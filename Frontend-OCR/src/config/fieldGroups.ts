// src/config/fieldGroups.ts
// Define como se agrupan columnas booleanas individuales de Airtable
// en una sola pregunta visual (dropdown o checkboxes) en el front.

export type GroupType = 'single' | 'multi';

export interface FieldGroupOption {
  key:   string;  // nombre de la columna boolean en Airtable
  label: string;  // texto legible para mostrar
}

export interface FieldGroup {
  groupKey:      string;   // identificador unico del grupo (no es una columna real)
  label:         string;   // titulo de la pregunta
  type:          GroupType;
  options:       FieldGroupOption[];
  otherTextKey?: string;   // columna de texto libre asociada a la opcion "Otro", si existe
}

export const FIELD_GROUPS: FieldGroup[] = [
  // ─── Encuesta (p3) ──────────────────────────────────────────────────
  {
    groupKey: 'p3_eliminacion_sanitaria',
    label: 'Eliminación sanitaria',
    type: 'single',
    options: [
      { key: 'p3_eliminacion_no_tiene',    label: 'No tiene' },
      { key: 'p3_eliminacion_cloaca',      label: 'Cloaca' },
      { key: 'p3_eliminacion_pozo_ciego',  label: 'Pozo ciego' },
    ],
  },
  {
    groupKey: 'p3_donde_van_bano',
    label: 'Dónde van al baño',
    type: 'single',
    options: [
      { key: 'p3_bano_no_tiene',    label: 'No tiene' },
      { key: 'p3_bano_si_adentro',  label: 'Sí, adentro' },
      { key: 'p3_bano_si_afuera',   label: 'Sí, afuera' },
    ],
  },
  {
    groupKey: 'p3_observar_terreno',
    label: 'Observaciones del terreno',
    type: 'multi',
    options: [
      { key: 'p3_terreno_presencia_basura',     label: 'Presencia de basura' },
      { key: 'p3_terreno_chatarra',             label: 'Chatarra' },
      { key: 'p3_terreno_acumulacion_objetos',  label: 'Acumulación de objetos' },
      { key: 'p3_terreno_olores',               label: 'Olores' },
      { key: 'p3_terreno_animales',             label: 'Animales' },
    ],
  },
  {
    groupKey: 'p3_equipamiento_bano',
    label: 'Equipamiento del baño',
    type: 'multi',
    options: [
      { key: 'p3_cuenta_inodoro',           label: 'Inodoro' },
      { key: 'p3_cuenta_mochila_inodoro',   label: 'Mochila de inodoro' },
      { key: 'p3_cuenta_lavatorio',         label: 'Lavatorio' },
      { key: 'p3_cuenta_espacio_ducha',     label: 'Espacio de ducha' },
      { key: 'p3_cuenta_calefon_electrico', label: 'Calefón eléctrico' },
      { key: 'p3_cuenta_espejo',            label: 'Espejo' },
      { key: 'p3_cuenta_canillas',          label: 'Canillas' },
      { key: 'p3_cuenta_cortina_ducha',     label: 'Cortina de ducha' },
      { key: 'p3_cuenta_mueblecito',        label: 'Mueblecito' },
      { key: 'p3_cuenta_luz_enchufe',       label: 'Luz / enchufe' },
      { key: 'p3_cuenta_otro',              label: 'Otro' },
    ],
    otherTextKey: 'p3_cuenta_otro_texto',
  },
  {
    groupKey: 'p3_checklist_primera_visita',
    label: 'Checklist primera visita',
    type: 'multi',
    options: [
      { key: 'p3_check_ubicacion_mapa',      label: 'Ubicación en el mapa' },
      { key: 'p3_check_video_terreno',       label: 'Video del terreno' },
      { key: 'p3_check_foto_vivienda_calle', label: 'Foto de vivienda desde la calle' },
      { key: 'p3_check_foto_bano_actual',    label: 'Foto del baño actual' },
    ],
  },

  // ─── Encuesta (p4) ──────────────────────────────────────────────────
  {
    groupKey: 'p4_habitos_espacio',
    label: 'Hábitos que realizan en ese espacio',
    type: 'multi',
    options: [
      { key: 'p4_habito_lavado_manos',     label: 'Lavado de manos' },
      { key: 'p4_habito_cepillado_dientes',label: 'Cepillado de dientes' },
      { key: 'p4_habito_higiene_personal', label: 'Higiene personal' },
      { key: 'p4_habito_otro',             label: 'Otro' },
    ],
    otherTextKey: 'p4_habito_otro_texto',
  },
  {
    groupKey: 'p4_elementos_higiene',
    label: 'Elementos que usan diariamente',
    type: 'multi',
    options: [
      { key: 'p4_usa_jabon',           label: 'Jabón' },
      { key: 'p4_usa_shampoo',         label: 'Shampoo' },
      { key: 'p4_usa_acondicionador',  label: 'Acondicionador' },
      { key: 'p4_usa_cepillo_dientes', label: 'Cepillo de dientes' },
      { key: 'p4_usa_pasta_dental',    label: 'Pasta dental' },
      { key: 'p4_usa_otro',            label: 'Otro' },
    ],
    otherTextKey: 'p4_usa_otro_texto',
  },
  {
    groupKey: 'p4_gestion_residuos',
    label: 'Cómo gestionan los residuos',
    type: 'multi',
    options: [
      { key: 'p4_residuos_hay_recoleccion',     label: 'Hay recolección' },
      { key: 'p4_residuos_se_lo_llevan_carro',  label: 'Se lo llevan con un carro' },
      { key: 'p4_residuos_se_quema',            label: 'Se quema' },
      { key: 'p4_residuos_se_recicla',          label: 'Se recicla' },
      { key: 'p4_residuos_otro',                label: 'Otro' },
    ],
    otherTextKey: 'p4_residuos_otro_texto',
  },
  {
    groupKey: 'p4_donde_descartan',
    label: 'Dónde descartan el producto usado',
    type: 'single',
    options: [
      { key: 'p4_tacho_basura_en_bano',    label: 'Tacho de basura en el baño' },
      { key: 'p4_tacho_basura_otro_lugar', label: 'Tacho de basura en otro lugar' },
      { key: 'p4_tacho_otro',              label: 'Otro' },
    ],
    otherTextKey: 'p4_tacho_otro_texto',
  },
  {
    groupKey: 'p4_higiene_menstrual',
    label: 'Elementos que usan en su ciclo menstrual',
    type: 'multi',
    options: [
      { key: 'p4_menstrual_ninguno',              label: 'Ninguno' },
      { key: 'p4_menstrual_toallita_descartable', label: 'Toallita descartable' },
      { key: 'p4_menstrual_toallita_tela',        label: 'Toallita de tela' },
      { key: 'p4_menstrual_tampon',               label: 'Tampón' },
      { key: 'p4_menstrual_otro',                 label: 'Otro' },
    ],
    otherTextKey: 'p4_menstrual_otro_texto',
  },
  {
    groupKey: 'p4_checklist_segunda_visita',
    label: 'Checklist segunda visita',
    type: 'multi',
    options: [
      { key: 'p4_check_video_adentro_vivienda', label: 'Video adentro de la vivienda' },
      { key: 'p4_check_foto_familia',           label: 'Foto de familia' },
      { key: 'p4_check_fotos_videos_dudas',     label: 'Fotos/videos de dudas' },
    ],
  },

  // ─── Inspección Técnica (p1) ────────────────────────────────────────
  {
    groupKey: 'p1_tipo_bano',
    label: 'El baño va',
    type: 'single',
    options: [
      { key: 'p1_anexado',      label: 'Anexado' },
      { key: 'p1_independiente',label: 'Independiente' },
    ],
  },
  {
    groupKey: 'p1_altura_pared_anexado',
    label: 'Altura de la pared donde se anexa',
    type: 'single',
    options: [
      { key: 'p1_pared_anexo_mayor_a_2_60_mts',  label: 'Mayor a 2,60 mts' },
      { key: 'p1_pared_anexo_menor_a_2_60_mts',  label: 'Menor a 2,60 mts' },
    ],
  },
  {
    groupKey: 'p1_canaleta',
    label: 'Canaleta',
    type: 'single',
    options: [
      { key: 'p1_canaleta_no_requerida_pendiente_techo_otra_direccion', label: 'No requerida (pendiente hacia otra dirección)' },
      { key: 'p1_canaleta_requerida_pendiente_techo_cae_hacia_bano',    label: 'Requerida (pendiente cae hacia el baño)' },
      { key: 'p1_cortar_chapa_dejando_alero_5cm',                      label: 'Cortar chapa dejando alero de 5cm' },
    ],
  },
  {
    groupKey: 'p1_tareas_biopozo',
    label: 'Tareas del biopozo',
    type: 'multi',
    options: [
      { key: 'p1_biopozo_pozo_1x1_50',              label: 'Pozo de 1x1,50mts y 1m de profundidad' },
      { key: 'p1_biopozo_marcado_terreno',          label: 'Marcado en el terreno' },
      { key: 'p1_biopozo_10_baldes_escombros',      label: 'Conseguir 10 baldes de escombros' },
      { key: 'p1_biopozo_marcar_campo_infiltracion',label: 'Marcar campo de infiltración' },
    ],
  },
  {
    groupKey: 'p1_tareas_pozo_ciego',
    label: 'Estado del pozo ciego',
    type: 'multi',
    options: [
      { key: 'p1_pozo_ciego_calzado',               label: 'Calzado' },
      { key: 'p1_pozo_ciego_tapado',                label: 'Tapado' },
      { key: 'p1_pozo_ciego_tiene_camara_inspeccion',label: 'Tiene cámara de inspección' },
      { key: 'p1_pozo_ciego_otro',                  label: 'Otro' },
    ],
    otherTextKey: 'p1_pozo_ciego_otro_texto',
  },
  {
    groupKey: 'p1_electricidad',
    label: 'Electricidad',
    type: 'single',
    options: [
      { key: 'p1_electricidad_si_se_puede_conectar_en_cc', label: 'Se puede conectar en la CC' },
      { key: 'p1_electricidad_no_se_puede_conectar_en_cc', label: 'No se puede conectar en la CC' },
      { key: 'p1_electricidad_tengo_dudas',                label: 'Tengo dudas' },
    ],
  },
  {
    groupKey: 'p1_agua',
    label: 'Agua',
    type: 'single',
    options: [
      { key: 'p1_agua_si_se_puede_conectar_en_cc', label: 'Se puede conectar en la CC' },
      { key: 'p1_agua_no_se_puede_conectar_en_cc', label: 'No se puede conectar en la CC' },
      { key: 'p1_agua_tengo_dudas',                label: 'Tengo dudas' },
    ],
  },
  {
    groupKey: 'p1_info_adicional_terreno',
    label: 'Observaciones adicionales del terreno',
    type: 'multi',
    options: [
      { key: 'p1_mucha_basura_terreno', label: 'Hay mucha basura en el terreno' },
      { key: 'p1_desorden_vivienda',    label: 'Desorden en la vivienda' },
    ],
  },

  // ─── Inspección Técnica (p2) ────────────────────────────────────────
  {
    groupKey: 'p2_checklist_plano',
    label: 'Checklist del plano (vista de arriba)',
    type: 'multi',
    options: [
      { key: 'p2_plano_ubicacion_bano_apertura_puerta', label: 'Ubicación del baño y apertura de puerta' },
      { key: 'p2_plano_caida_techo_casa',                label: 'Caída del techo de la casa' },
      { key: 'p2_plano_ubicacion_pozo_ciego_camara',     label: 'Ubicación del pozo ciego / cámara' },
      { key: 'p2_plano_ubicacion_pozo_bp',               label: 'Ubicación del pozo del biopozo' },
      { key: 'p2_plano_recorrido_campo_infiltracion',    label: 'Recorrido del campo de infiltración' },
      { key: 'p2_plano_fuente_agua_distancia',           label: 'Fuente de agua y distancia' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Set de todas las columnas que pertenecen a algún grupo (para excluirlas del loop de campos sueltos) */
export const GROUPED_FIELD_KEYS: Set<string> = new Set(
  FIELD_GROUPS.flatMap(g => g.options.map(o => o.key))
);

/** Devuelve el valor elegido en un grupo single, o null si ninguna opción está en true */
export function getSingleGroupValue(group: FieldGroup, campos: Record<string, any>): string | null {
  const selected = group.options.find(opt => campos[opt.key] === true || campos[opt.key] === 'true');
  return selected?.key ?? null;
}

/** Devuelve las keys seleccionadas en un grupo multi */
export function getMultiGroupValues(group: FieldGroup, campos: Record<string, any>): string[] {
  return group.options
    .filter(opt => campos[opt.key] === true || campos[opt.key] === 'true')
    .map(opt => opt.key);
}

