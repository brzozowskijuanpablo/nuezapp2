export interface Nutrient {
  name: string;
  badge: string;
  description: string;
}

export interface AffectionBenefit {
  condition: string;
  benefit: string;
  icon: string;
}

export interface ProductBenefitInfo {
  tagline: string;
  summary: string;
  nutrients: Nutrient[];
  affections: AffectionBenefit[];
  consumptionTip: string;
}

export function getProductBenefits(name: string, category: string): ProductBenefitInfo {
  const n = name.toLowerCase();
  const c = category.toUpperCase();

  // 1. NUEZ / NUECES
  if (n.includes('nuez') || n.includes('nueces')) {
    return {
      tagline: 'El superalimento por excelencia para el cerebro y el corazón',
      summary: 'Rica fuente de ácidos grasos esenciales Omega 3 de origen vegetal, polifenoles antioxidantes y minerales neuroprotectores.',
      nutrients: [
        { name: 'Omega 3 (ALA)', badge: 'Corazón & Cerebro', description: 'Ácidos grasos esenciales que protegen las neuronas y arterias.' },
        { name: 'Magnesio', badge: 'Músculo & Nervios', description: 'Relaja la musculatura y disminuye el estrés oxidativo.' },
        { name: 'Vitamina E', badge: 'Antioxidante', description: 'Protege las membranas celulares del envejecimiento.' },
        { name: 'Fósforo y Cobre', badge: 'Minerales', description: 'Fortalecen la estructura ósea y la absorción de energía.' }
      ],
      affections: [
        { condition: 'Colesterol alto y Salud Cardíaca', benefit: 'Reduce el colesterol LDL y triglicéridos, mejorando la circulación.', icon: '🫀' },
        { condition: 'Estrés mental, Niebla cognitiva y Memoria', benefit: 'Mejora la agilidad mental y la concentración gracias a sus neuroprotectores.', icon: '🧠' },
        { condition: 'Inflamación celular y Envejecimiento', benefit: 'Sus polifenoles combaten el daño de radicales libres en todos los tejidos.', icon: '🛡️' }
      ],
      consumptionTip: 'Consumir 4 a 6 mitades diarias como colación o añadidas a ensaladas y yogures.'
    };
  }

  // 2. ALMENDRAS
  if (n.includes('almendra')) {
    return {
      tagline: 'Aliada fundamental para los huesos, la piel y la saciedad',
      summary: 'Una de las fuentes vegetales con mayor concentración de Calcio, Vitamina E, Magnesio y proteína de alta digestibilidad.',
      nutrients: [
        { name: 'Calcio', badge: 'Salud Ósea', description: 'Clave para la densidad mineral ósea y la contracción muscular.' },
        { name: 'Vitamina E', badge: 'Piel Radiante', description: 'Potente antioxidante lipofílico que hidrata y regenera la dermis.' },
        { name: 'Magnesio y Potasio', badge: 'Presión Arterial', description: 'Favorece el balance electrolítico y calma calambres.' },
        { name: 'Fibra Dietaria', badge: 'Digestión', description: 'Prolonga la saciedad y estabiliza la curva de glucosa.' }
      ],
      affections: [
        { condition: 'Osteopenia, Osteoporosis y Calambres', benefit: 'Aporta calcio biodisponible y magnesio para fortalecer huesos y articulaciones.', icon: '🦴' },
        { condition: 'Resequedad en piel y Envejecimiento dérmico', benefit: 'Nutre desde el interior, devolviendo tersura y elasticidad a la piel.', icon: '✨' },
        { condition: 'Ansiedad por comer y Picos de azúcar', benefit: 'Ideal para dietas bajas en carbohidratos, sacia el apetito sin elevar la glucemia.', icon: '⚖️' }
      ],
      consumptionTip: 'Ideales activadas (remojadas en agua unas horas) o tostadas naturalmente sin sal.'
    };
  }

  // 3. CASTAÑAS DE CAJÚ / ANACARDOS
  if (n.includes('caju') || n.includes('cajú') || n.includes('anacardo')) {
    return {
      tagline: 'Fuente pura de energía, Zinc, Triptófano y grasas buenas',
      summary: 'Deliciosas, cremosas y cargadas de Triptófano precursor de serotonina, Zinc inmunológico y Cobre.',
      nutrients: [
        { name: 'Triptófano', badge: 'Buen Humor', description: 'Aminoácido esencial precursor de la serotonina y melatonina.' },
        { name: 'Zinc', badge: 'Inmunidad', description: 'Vital para el sistema inmunitario y la regeneración celular.' },
        { name: 'Hierro', badge: 'Energía Vital', description: 'Combate la fatiga transportando oxígeno a los tejidos.' },
        { name: 'Ácido Oleico', badge: 'Grasas Sanas', description: 'Grasa monoinsaturada protectora del sistema cardiovascular.' }
      ],
      affections: [
        { condition: 'Insomnio, Depresión leve y Desgano', benefit: 'Estimula la síntesis de serotonina promoviendo relajación y mejor ánimo.', icon: '🌙' },
        { condition: 'Defensas bajas y Caída del cabello', benefit: 'El Zinc fortalece la raíz capilar y potencia los linfocitos de defensa.', icon: '🛡️' },
        { condition: 'Fatiga muscular y Cansancio crónico', benefit: 'Aporte energético continuo y revitalización celular.', icon: '⚡' }
      ],
      consumptionTip: 'Ideales para consumir solas o para preparar quesos y cremas vegetales veganas.'
    };
  }

  // 4. AVELLANAS / PISTACHOS
  if (n.includes('avellana') || n.includes('pistacho')) {
    return {
      tagline: 'Poderoso complejo de Vitamina B6, Biotina y Luteína',
      summary: 'Destacan por su contenido en Vitamina B6, Ácido fólico y antioxidantes como la Luteína y Zeaxantina que cuidan la vista.',
      nutrients: [
        { name: 'Vitamina B6', badge: 'Sistema Nervioso', description: 'Regula neurotransmisores y apoya el metabolismo proteico.' },
        { name: 'Luteína & Zeaxantina', badge: 'Salud Ocular', description: 'Carotenoides que protegen la retina de la luz azul.' },
        { name: 'Potasio', badge: 'Control Tensional', description: 'Equilibra la retención de líquidos y la presión.' },
        { name: 'Biotina', badge: 'Cabello & Uñas', description: 'Fortalece las uñas quebradizas y la hebra capilar.' }
      ],
      affections: [
        { condition: 'Fatiga visual y Degeneración macular', benefit: 'Protege los ojos del cansancio provocado por pantallas digitales.', icon: '👁️' },
        { condition: 'Anemia y Cansancio metabólico', benefit: 'Facilita la producción de hemoglobina y asimilación de nutrientes.', icon: '🩸' },
        { condition: 'Hipertensión y Retención de líquidos', benefit: 'Su alto ratio Potasio/Sodio ayuda a descongestionar el sistema vascular.', icon: '💧' }
      ],
      consumptionTip: 'Un puñado pequeño a media mañana es el snack perfecto para mantener el enfoque.'
    };
  }

  // 5. CHÍA / LINO / SEMILLAS
  if (n.includes('chia') || n.includes('chía') || n.includes('lino') || n.includes('semilla') || n.includes('sesamo') || n.includes('sésamo') || n.includes('girasol') || n.includes('zapallo')) {
    return {
      tagline: 'Bomba de Mucílagos, Fibra Soluble, Omega 3 y Zinc',
      summary: 'Reguladoras naturales del tránsito intestinal, desinflamatorias del colon y protectoras hormonales y prostáticas.',
      nutrients: [
        { name: 'Fibra Soluble & Mucílagos', badge: 'Salud Intestinal', description: 'Crea un gel protector que limpia y suaviza el tracto digestivo.' },
        { name: 'Omega 3 & 6', badge: 'Antiinflamatorio', description: 'Equilibrio lipídico natural para desinflamar mucosas.' },
        { name: 'Zinc y Fitoesteroles', badge: 'Salud Hormonal', description: 'Especialmente en semillas de zapallo, cuidan la próstata y el balance hormonal.' },
        { name: 'Calcio Biodisponible', badge: 'Dientes y Huesos', description: 'Excelente fuente mineral alternativa a los lácteos.' }
      ],
      affections: [
        { condition: 'Estreñimiento, Colon Irritable e Hinchazón', benefit: 'Normaliza la frecuencia de evacuación y calma la inflamación intestinal.', icon: '🌿' },
        { condition: 'Colesterol, Triglicéridos y Glucemia alta', benefit: 'Atrapa lípidos y azúcares en el tubo digestivo, frenando su absorción excesiva.', icon: '🩸' },
        { condition: 'Molestias Prostáticas e Inflamación Urinaria', benefit: 'Las semillas de zapallo descongestionan y protegen la salud urogenital.', icon: '🛡️' }
      ],
      consumptionTip: 'Dejar hidratar 15 minutos en agua, jugo o yogur para activar sus mucílagos prebióticos.'
    };
  }

  // 6. CÚRCUMA / JENGIBRE
  if (n.includes('curcuma') || n.includes('cúrcuma') || n.includes('jengibre')) {
    return {
      tagline: 'El rey de los antiinflamatorios y digestivos naturales',
      summary: 'Con Curcumina y Gingerol bioactivos, reconocidos mundialmente por su capacidad para frenar procesos inflamatorios articulares.',
      nutrients: [
        { name: 'Curcumina / Gingerol', badge: 'Antiinflamatorio', description: 'Inhibe mediadores inflamatorios celulares de forma natural.' },
        { name: 'Vitamina C y Minerales', badge: 'Inmunidad', description: 'Estimula los leucocitos y la respuesta inmunológica.' },
        { name: 'Aceites Esenciales', badge: 'Digestivo', description: 'Favorece la producción de enzimas gástricas y biliares.' },
        { name: 'Antioxidantes Polifenólicos', badge: 'Detox Hepático', description: 'Depura el hígado y protege las células hepáticas.' }
      ],
      affections: [
        { condition: 'Dolor Articular, Artritis y Tendinitis', benefit: 'Alivia la rigidez y el dolor crónico en articulaciones sin agredir el estómago.', icon: '🦴' },
        { condition: 'Náuseas, Digestión pesada y Gases', benefit: 'Acelera el vaciamiento gástrico y reduce la hinchazón abdominal.', icon: '🫁' },
        { condition: 'Gripes, Resfríos y Defensas bajas', benefit: 'Efecto descongestivo, calorífico y antimicrobiano natural.', icon: '☕' }
      ],
      consumptionTip: 'Consumir con una pizca de pimienta negra o aceite para multiplicar su absorción hasta un 2000%.'
    };
  }

  // 7. HIERBAS MEDICINALES (Tilo, Manzanilla, Valeriana, Boldo, Carqueja, etc.)
  if (c.includes('MEDICINAL') || n.includes('tilo') || n.includes('manzanilla') || n.includes('valeriana') || n.includes('boldo') || n.includes('carqueja') || n.includes('te ') || n.includes('té ') || n.includes('infusion') || n.includes('menta') || n.includes('cedron') || n.includes('cedrón') || n.includes('melisa')) {
    return {
      tagline: 'Fitoterapia milenaria para el sistema nervioso y digestivo',
      summary: 'Extractos botánicos puros con flavonoides calmantes, aceites esenciales carminativos y principios amargos hepatoprotectores.',
      nutrients: [
        { name: 'Flavonoides (Apigenina)', badge: 'Calmante', description: 'Se une a receptores del sistema nervioso relajando la mente.' },
        { name: 'Aceites Esenciales', badge: 'Antiespasmódico', description: 'Alivian los cólicos, espasmos estomacales y contracturas.' },
        { name: 'Principios Amargos', badge: 'Hígado Sano', description: 'Estimulan la secreción de bilis y la desintoxicación hepática.' },
        { name: 'Polifenoles', badge: 'Antioxidante', description: 'Protegen la mucosa gastrointestinal de irritaciones.' }
      ],
      affections: [
        { condition: 'Insomnio, Ansiedad, Nerviosismo y Estrés', benefit: 'Facilita conciliar el sueño profundo y calma palpitaciones por nervios.', icon: '🌙' },
        { condition: 'Digestiones lentas, Hígado graso y Acidez', benefit: 'Depura el hígado y calma la pesadez tras comidas abundantes.', icon: '🌿' },
        { condition: 'Dolores de Cabeza y Dolores Menstruales', benefit: 'Efecto sedante suave y antiespasmódico sobre la musculatura lisa.', icon: '💆' }
      ],
      consumptionTip: 'Infusionar 1 cucharadita en agua a 90°C tapado durante 5 a 8 minutos antes de beber.'
    };
  }

  // 8. ACEITES (Oliva, Coco, Lino, Almendras)
  if (c.includes('ACEITES') || n.includes('aceite') || n.includes('oliva') || n.includes('coco')) {
    return {
      tagline: 'Ácidos grasos puros, Vitamina E y protección vascular',
      summary: 'Prensado en frío que conserva polifenoles bioactivos, triglicéridos de cadena media y antioxidantes liposolubles.',
      nutrients: [
        { name: 'Ácido Oleico (Omega 9)', badge: 'Salud Arterial', description: 'Protege las paredes vasculares y previene aterosclerosis.' },
        { name: 'Vitamina E & Escualeno', badge: 'Antiedad', description: 'Nutre profundamente la piel y combate la resequedad.' },
        { name: 'Triglicéridos de Cadena Media', badge: 'Energía Inmediata', description: 'En aceite de coco, se convierte en energía cetónica limpia.' },
        { name: 'Polifenoles Oleocantal', badge: 'Antiinflamatorio', description: 'Compuesto natural similar al ibuprofeno para la inflamación.' }
      ],
      affections: [
        { condition: 'Enfermedades Cardiovasculares y Presión', benefit: 'Mantiene las arterias flexibles y reduce la oxidación del colesterol.', icon: '🫀' },
        { condition: 'Piel seca, Eccemas y Pelo quebradizo', benefit: 'Restaura la barrera lipídica cutánea tanto ingerido como tópico.', icon: '✨' },
        { condition: 'Inflamación Crónica y Salud Cerebral', benefit: 'Alimenta las vainas de mielina cerebrales y reduce inflamación sistémica.', icon: '🧠' }
      ],
      consumptionTip: 'Consumir en crudo en ensaladas o tostadas para preservar todos sus polifenoles intactos.'
    };
  }

  // 9. DÁTILES / PASAS / FRUTAS SECAS Y DESHIDRATADAS
  if (n.includes('datil') || n.includes('dátil') || n.includes('pasa') || n.includes('ciruela') || n.includes('higo') || n.includes('arandano') || n.includes('arándano')) {
    return {
      tagline: 'Energía natural de rápida disponibilidad, Potasio y Hierro',
      summary: 'Endulzante natural ancestral repleto de minerales, fibra que previene el estreñimiento y glucosa natural para deportistas.',
      nutrients: [
        { name: 'Potasio', badge: 'Energía Muscular', description: 'Evita calambres y equilibra la hidratación celular.' },
        { name: 'Hierro No Hémico', badge: 'Antianémico', description: 'Favorece la formación de glóbulos rojos y combate la debilidad.' },
        { name: 'Fibra Insoluble & Pectinas', badge: 'Laxante Natural', description: 'Estimula el peristaltismo intestinal suavemente.' },
        { name: 'Antocianinas', badge: 'Vías Urinarias', description: 'En arándanos, previene adherencia bacteriana en la vejiga.' }
      ],
      affections: [
        { condition: 'Estreñimiento crónico e Intestino perezoso', benefit: 'Las ciruelas y dátiles ablandan y dinamizan el tránsito intestinal.', icon: '🌿' },
        { condition: 'Infecciones Urinarias y Cistitis recurrente', benefit: 'Los arándanos impiden la fijación de la bacteria E. Coli.', icon: '💧' },
        { condition: 'Fatiga física, Mareos y Debilidad muscular', benefit: 'Repone glucógeno y electrolitos rápidamente tras actividad intensa.', icon: '⚡' }
      ],
      consumptionTip: 'Excelente snack pre-entrenamiento o para endulzar batidos y postres sin azúcar refinada.'
    };
  }

  // 10. HARINAS SALUDABLES / AVENA / QUINOA / ALMACÉN GENERAL
  if (n.includes('avena') || n.includes('quinoa') || n.includes('harina') || n.includes('cacao') || n.includes('miel') || n.includes('polen') || n.includes('maca') || n.includes('spirulina')) {
    return {
      tagline: 'Nutrientes complejos, Betaglucanos, Proteína vegetal y Vigor',
      summary: 'Alimentos nobles de grano entero que nutren sin generar picos glucémicos, aportando energía sostenida y micronutrientes.',
      nutrients: [
        { name: 'Betaglucanos', badge: 'Reduce Colesterol', description: 'Fibra soluble que atrapa sales biliares bajando el colesterol en sangre.' },
        { name: 'Vitaminas del Complejo B', badge: 'Sistema Nervioso', description: 'Esenciales para convertir los alimentos en energía útil.' },
        { name: 'Aminoácidos Completos', badge: 'Masa Muscular', description: 'Construyen y reparan tejidos musculares y conectivos.' },
        { name: 'Magnesio & Hierro', badge: 'Anti-Fatiga', description: 'Combaten el agotamiento y relajan el tono vascular.' }
      ],
      affections: [
        { condition: 'Colesterol LDL elevado y Riesgo cardíaco', benefit: 'Los betaglucanos limpian el exceso de lípidos en el torrente sanguíneo.', icon: '🫀' },
        { condition: 'Desgano, Anemia y Déficit de concentración', benefit: 'Proporciona glucosa lenta al cerebro garantizando horas de concentración.', icon: '⚡' },
        { condition: 'Acidez estomacal y Gastritis', benefit: 'Suaviza y tapiza la mucosa gástrica protegiéndola de la acidez.', icon: '🛡️' }
      ],
      consumptionTip: 'Consumir en desayunos, bowls, panificados saludables o batidos energéticos.'
    };
  }

  // DEFAULT / GENÉRICO SALUDABLE
  return {
    tagline: 'Alimento natural seleccionado para una nutrición consciente y equilibrada',
    summary: 'Elaborado con materias primas seleccionadas, libre de aditivos artificiales, pensado para maximizar tu vitalidad diaria.',
    nutrients: [
      { name: 'Magnesio & Potasio', badge: 'Minerales Vitales', description: 'Favorecen el funcionamiento del sistema muscular y nervioso.' },
      { name: 'Antioxidantes Naturales', badge: 'Protección Celular', description: 'Neutralizan radicales libres previniendo el desgaste prematuro.' },
      { name: 'Fibra Dietética', badge: 'Equilibrio Digestivo', description: 'Promueve una flora bacteriana saludable y óptima digestión.' },
      { name: 'Grasas Saludables / Proteína', badge: 'Energía Limpia', description: 'Brinda saciedad y vitalidad sostenida a lo largo del día.' }
    ],
    affections: [
      { condition: 'Cansancio, Estrés y Sobrecarga diaria', benefit: 'Nutre el organismo con minerales esenciales que restablecen el equilibrio.', icon: '⚡' },
      { condition: 'Trastornos Digestivos y Pesadez', benefit: 'Alimento liviano y de fácil asimilación que no sobrecarga el estómago.', icon: '🌿' },
      { condition: 'Cuidado Preventivo y Bienestar Integral', benefit: 'Aporte natural que refuerza el sistema inmunitario y la vitalidad celular.', icon: '🛡️' }
    ],
    consumptionTip: 'Incorporar de forma regular en tu alimentación diaria para disfrutar de todos sus beneficios.'
  };
}