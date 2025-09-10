import React from "react";
import { Badge } from "@/components/ui/badge";

interface CollectionBadgeProps {
  collection?: string;
  className?: string;
}

export const CollectionBadge: React.FC<CollectionBadgeProps> = ({ collection, className }) => {
  const getCollectionColor = (collection?: string) => {
    switch (collection) {
      case 'Augmented Humanity (15)':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Mini-Series (3)':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'Standalone':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (!collection) return null;

  return (
    <Badge 
      className={`${getCollectionColor(collection)} text-white ${className}`}
    >
      {collection}
    </Badge>
  );
};