export function formatarParaBRL(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

export function parseBRL(valor: string): number {
    if (!valor) return 0;
    
    // Remove formatting characters (R$, dots, spaces)
    // Replace comma with dot
    const cleanValue = valor
        .replace(/[R$\s.]/g, '') // Remove R$, parsing dots (thousands) and spaces
        .replace(',', '.');      // Replace decimal comma with dot
        
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
}

// UI-only rounding helper (NOT for calculations)
export function arredondar2(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
}
