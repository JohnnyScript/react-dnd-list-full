import { ReactNode } from "react";

export interface DragAndDropListProps {
  id: string;
  elements: { [key: string]: unknown }[];
  keyProperty: keyof DragAndDropListProps["elements"][0];
  render: (item: { [key: string]: unknown }) => ReactNode;
  onChange?: (elements: unknown[]) => void;
  onChangeAsync?: (elements: unknown[]) => Promise<void>;
}
