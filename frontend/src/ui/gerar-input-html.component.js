export const gerarInputHTML = (campo) => {
    return `
        <div class="br-input">
            <label for="${campo.id}">${campo.label}</label>
            <input 
                type="${campo.tipo}" 
                id="${campo.id}" 
                name="${campo.id}" 
                value="${campo.valor}" 
                data-obrigatorio
            >
        </div>
    `;
};

export const gerarSelectHTML = (campo) => {
    // A função map aninhada gera a string de <option>s
    const optionsHTML = campo.options.map(option => {
        const isSelected = option.valor === campo.valor ? 'selected' : '';
        return `<option value="${option.valor}" ${isSelected}>${option.texto}</option>`;
    }).join('');

    return `
        <div class="br-select">
            <label for="${campo.id}">${campo.label}</label>
            <select 
                id="${campo.id}" 
                name="${campo.id}" 
                data-obrigatorio
            >
                ${optionsHTML}
            </select>
        </div>
    `;
};