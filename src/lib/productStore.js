// DummyJSON does not really save add/edit/delete, so the app keeps its own
// record of those changes in localStorage and merges them into API results.
const STORAGE_KEY = "pa_product_changes";
const FIRST_LOCAL_ID = 1001;

function emptyChanges() {
  return { created: [], updated: {}, deleted: [], nextId: FIRST_LOCAL_ID };
}

function readChanges() {
  if (typeof window === "undefined") return emptyChanges();
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored ? { ...emptyChanges(), ...stored } : emptyChanges();
  } catch {
    return emptyChanges();
  }
}

function writeChanges(changes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
}

export function isLocalProduct(id) {
  return Number(id) >= FIRST_LOCAL_ID;
}

export function recordCreate(product) {
  const changes = readChanges();
  const created = { ...product, id: changes.nextId };
  changes.created.unshift(created);
  changes.nextId += 1;
  writeChanges(changes);
  return created;
}

export function recordUpdate(id, fields) {
  const changes = readChanges();
  const numericId = Number(id);
  if (isLocalProduct(numericId)) {
    changes.created = changes.created.map((product) =>
      product.id === numericId ? { ...product, ...fields } : product
    );
  } else {
    changes.updated[numericId] = { ...changes.updated[numericId], ...fields };
  }
  writeChanges(changes);
}

export function recordDelete(id) {
  const changes = readChanges();
  const numericId = Number(id);
  changes.created = changes.created.filter((product) => product.id !== numericId);
  delete changes.updated[numericId];
  if (!changes.deleted.includes(numericId)) changes.deleted.push(numericId);
  writeChanges(changes);
}

export function applyChangesToProduct(product) {
  const { updated, deleted } = readChanges();
  if (deleted.includes(product.id)) return null;
  return { ...product, ...updated[product.id] };
}

export function getLocalProduct(id) {
  const numericId = Number(id);
  return readChanges().created.find((product) => product.id === numericId) ?? null;
}

// Created products are returned separately (shown above the table on the
// unfiltered first page) because the API's limit/skip pagination cannot include them.
export function applyChangesToList(data, query) {
  const { created, updated, deleted } = readChanges();
  const kept = data.products
    .filter((product) => !deleted.includes(product.id))
    .map((product) => ({ ...product, ...updated[product.id] }));

  const isDefaultView = !query.q && !query.category;
  const deletedServerCount = deleted.filter((id) => !isLocalProduct(id)).length;
  const removedOnPage = data.products.length - kept.length;

  return {
    ...data,
    products: kept,
    // Unfiltered: every deleted API product belongs to this total. Filtered: only
    // the ones seen on this page are known, so the count is a best effort.
    total: data.total - (isDefaultView ? deletedServerCount : removedOnPage),
    localProducts: isDefaultView && query.page === 1 ? created : [],
  };
}
