export const EMPTY_PRODUCT = {
  title: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  description: "",
};

export function validateProduct(values) {
  const errors = {};
  const title = values.title.trim();
  const price = Number(values.price);
  const stock = Number(values.stock);

  if (!title) errors.title = "Title is required.";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 100) errors.title = "Title must be 100 characters or fewer.";

  if (values.price === "") errors.price = "Price is required.";
  else if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be greater than 0.";

  if (values.stock === "") errors.stock = "Stock is required.";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number, 0 or more.";

  if (!values.category) errors.category = "Pick a category.";

  if (values.description.length > 500) {
    errors.description = "Description must be 500 characters or fewer.";
  }

  return errors;
}

export function toProductPayload(values) {
  return {
    title: values.title.trim(),
    price: Number(values.price),
    stock: Number(values.stock),
    category: values.category,
    brand: values.brand.trim(),
    description: values.description.trim(),
  };
}

export function toFormValues(product) {
  return {
    title: product.title ?? "",
    price: String(product.price ?? ""),
    stock: String(product.stock ?? ""),
    category: product.category ?? "",
    brand: product.brand ?? "",
    description: product.description ?? "",
  };
}
