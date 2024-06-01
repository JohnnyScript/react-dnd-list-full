import { FC, useCallback, useEffect, useState } from "react";

import { DragAndDropListProps } from "./DragAndDropList.types";

export const DragAndDropList: FC<DragAndDropListProps> = ({
  id,
  render,
  elements,
  onChange,
  keyProperty,
  onChangeAsync,
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<{ [key: string]: unknown }[]>(elements);
  const [draggingItem, setDragginItem] = useState<
    (typeof items)[0] | undefined
  >(undefined);

  useEffect(() => {
    setItems(elements);
  }, [elements]);

  const handlerOnChange = useCallback(
    (list: typeof items) => {
      if (onChange) onChange(list);
      else if (onChangeAsync) {
        setLoading(true);
        onChangeAsync(list).finally(() => setLoading(false));
      }
    },
    [items]
  );

  useEffect(() => {
    if (onChange) onChange(items);
    else if (onChangeAsync) {
      setLoading(true);
      onChangeAsync(items).finally(() => setLoading(false));
    }
  }, [items]);

  const handleDragStart = useCallback((e: any, item: (typeof items)[0]) => {
    setDragginItem(item);
    e.dataTransfer?.setData("text/plain", "");
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragginItem(undefined);
  }, []);

  const handleDragOver = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const handleDrop = (_: any, targetItem: (typeof items)[0]) => {
    if (!draggingItem) return;

    const currentIndex = items.indexOf(draggingItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      items.splice(currentIndex, 1);
      items.splice(targetIndex, 0, draggingItem);
      setItems([...items]);
    }
  };

  return (
    <ul id={`grag-drop-list-${id}`} className="ul-dnd-list-full">
      {items.map((item, index) => (
        <li
          draggable
          key={item[keyProperty] as string | number}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          onDragStart={(e) => handleDragStart(e, item)}
          className={`li-dnd-list-full ${
            item === draggingItem ? "opacity-60" : ""
          }`}
        >
          {render({ ...item, index })}
        </li>
      ))}
      {loading && (
        <div className="loader-container-dnd-list-full">
          <span className="loader" />
        </div>
      )}
    </ul>
  );
};
