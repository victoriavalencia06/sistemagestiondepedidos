// src/constants/reporteConstants.js

export const TIPOS_REPORTE = [
    { value: 'ventas', label: 'Ventas' },
    { value: 'inventario', label: 'Inventario' },
    { value: 'logistica', label: 'Logística' },
    { value: 'calidad', label: 'Calidad' },
    { value: 'financiero', label: 'Financiero' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'queja', label: 'Queja' },
    { value: 'sugerencia', label: 'Sugerencia' },
    { value: 'reclamo', label: 'Reclamo' },
    { value: 'incidencia', label: 'Incidencia' },
    { value: 'mejora', label: 'Mejora' },
    { value: 'problema_tecnico', label: 'Problema Técnico' },
    { value: 'soporte', label: 'Soporte' },
    { value: 'capacitacion', label: 'Capacitación' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'mantenimiento', label: 'Mantenimiento' },
    { value: 'otro', label: 'Otro' }
];

export const getTipoReporteLabel = (tipo) => {
    if (!tipo) return 'No especificado';
    const tipoObj = TIPOS_REPORTE.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
};

export const getTipoReporteValue = (label) => {
    if (!label) return '';
    const tipoObj = TIPOS_REPORTE.find(t => t.label === label);
    return tipoObj ? tipoObj.value : label.toLowerCase().replace(/\s+/g, '_');
};