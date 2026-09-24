import { ApiError } from "@/lib/axios";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/api/productsApi";
import {
  applyChangesToList,
  applyChangesToProduct,
  getLocalProduct,
  isLocalProduct,
  recordCreate,
  recordDelete,
  recordUpdate,
} from "@/lib/productStore";

const PLACEHOLDER_IMAGE = "https://dummyjson.com/image/300x300/e5e7eb/6b7280?text=New";

export async function loadProductList(query, signal) {
  const data = await getProducts(query, { signal });
  return applyChangesToList(data, query);
}

export async function loadProduct(id, signal) {
  if (isLocalProduct(id)) {
    const local = getLocalProduct(id);
    if (!local) throw new ApiError(`Product with id '${id}' not found`, 404);
    return local;
  }
  const product = applyChangesToProduct(await getProductById(id, { signal }));
  if (!product) throw new ApiError(`Product with id '${id}' not found`, 404);
  return product;
}

// Each mutation asks the API first (so real validation/network errors surface),
// then records the change locally because the API does not persist it.
export async function addProduct(payload) {
  await createProduct(payload);
  return recordCreate({
    ...payload,
    rating: 0,
    thumbnail: PLACEHOLDER_IMAGE,
    images: [PLACEHOLDER_IMAGE],
    reviews: [],
  });
}

export async function editProduct(id, payload) {
  if (!isLocalProduct(id)) await updateProduct(id, payload);
  recordUpdate(id, payload);
}

export async function removeProduct(id) {
  if (!isLocalProduct(id)) await deleteProduct(id);
  recordDelete(id);
}
