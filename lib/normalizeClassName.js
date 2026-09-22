export function normalizeClassName(value) {
  if (!value) return "";

  let className = value.trim();

  // Remove "grade" if user already typed it
  className = className.replace(/^grade\s*/i, "").trim();

  // If only a number remains, standardize it
  if (/^\d+$/.test(className)) {
    return `Grade ${Number(className)}`;
  }

  // Otherwise keep the entered value
  return value.trim();
}