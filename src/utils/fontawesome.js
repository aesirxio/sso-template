import { icon } from "@fortawesome/fontawesome-svg-core";
export function fontAwesomeLoad(element, elementIcon) {
  let list = document.querySelectorAll(element);
  if (list) {
    list.forEach(function (item, index) {
      item.prepend(icon(elementIcon).node[0]);
    });
  }
}
