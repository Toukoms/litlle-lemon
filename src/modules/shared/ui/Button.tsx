type ButtonProps = {
  variant?: string;
} & React.ComponentProps<"button">;

export function Button({ variant, ...props }: ButtonProps) {
  console.log(variant);
  return <button {...props}>Button</button>;
}
