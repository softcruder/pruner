import React from 'react';

type GradientComponentProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const GradientText = <T extends React.ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: GradientComponentProps<T>) => {
  const Component = as || 'div';
  return (
    <Component
      className={`gradient-text ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GradientText;
