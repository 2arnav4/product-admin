"use client";

import { useRef, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getCategories } from "@/api/productsApi";
import { toProductPayload, validateProduct } from "@/lib/productValidation";

const fetchCategories = (signal) => getCategories({ signal });

const inputClass = "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900";

function Field({ label, error, children }) {
  return (
    <label className="block text-sm text-gray-700">
      {label}
      {children}
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}

export default function ProductForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const { data: categories } = useFetch(fetchCategories);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;

    const validationErrors = validateProduct(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    savingRef.current = true;
    setIsSaving(true);
    setSubmitError("");

    try {
      await onSubmit(toProductPayload(values));
    } catch (err) {
      setSubmitError(err.message);
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-4">
      <Field label="Title" error={errors.title}>
        <input name="title" value={values.title} onChange={handleChange} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (USD)" error={errors.price}>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
        <Field label="Stock" error={errors.stock}>
          <input
            name="stock"
            type="number"
            step="1"
            min="0"
            value={values.stock}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" error={errors.category}>
          <select name="category" value={values.category} onChange={handleChange} className={inputClass}>
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Brand (optional)">
          <input name="brand" value={values.brand} onChange={handleChange} className={inputClass} />
        </Field>
      </div>

      <Field label="Description (optional)" error={errors.description}>
        <textarea
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      {submitError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSaving ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
