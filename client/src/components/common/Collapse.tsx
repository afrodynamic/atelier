import { FC, ReactNode, useState } from 'react';

interface CollapseProps {
  title: ReactNode;
  children: ReactNode;
}

export const Collapse: FC<CollapseProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)}>
        {title}
      </div>
      {isOpen && children}
    </div>
  );
};
