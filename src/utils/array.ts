export function arrayMove(arr, old_index, new_index) {
  new_index = ((new_index % arr.length) + arr.length) % arr.length;
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}
