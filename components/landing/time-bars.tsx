// Compara o prazo de sempre com o da PINE: a barra da PINE enche rápido, a outra se arrasta.
// A animação é CSS (hero.css) e começa depois da sequência do hero.
export function TimeBars() {
  return (
    <div className="barras" aria-label="O jeito de sempre leva 90 dias. Na PINE, dias.">
      <div className="barra barra-sempre">
        <span className="etiqueta text-creme/60">O jeito de sempre</span>
        <div className="trilho"><div className="preenche" /></div>
        <span className="etiqueta text-creme/60 text-right">90 dias</span>
      </div>
      <div className="barra barra-pine">
        <span className="etiqueta text-creme">PINE</span>
        <div className="trilho"><div className="preenche" /></div>
        <span className="etiqueta text-creme text-right">dias</span>
      </div>
    </div>
  );
}
