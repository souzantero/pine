/* eslint-disable @next/next/no-img-element */

// Logo horizontal da marca: "cor" sobre fundo escuro, "negativo" sobre fundo claro.
// Os SVGs vêm de brand/logo/svg; a altura é definida pelo className.
export function Logo({ versao, className }: { versao: "cor" | "negativo"; className?: string }) {
  return (
    <img
      src={`/logo/pine-horizontal-${versao}.svg`}
      alt="PINE"
      width={580}
      height={180}
      className={className}
    />
  );
}
