
/**
 * Mapeamento de marcas e modelos por tipo de veículo
 */

// Definir as marcas para carros
export const carBrands = [
  'Agrale', 'Alfa Romeo', 'Americar', 'Asia', 'Aston Martin', 'Audi', 'Austin-healey', 'Avallone', 
  'Bentley', 'Bmw', 'Brm', 'Bugre', 'Bugway', 'Byd', 'Cadillac', 'Caoa Chery', 'Cbt', 'Chamonix', 
  'Chevrolet', 'Chrysler', 'Citroën', 'Daewoo', 'Daihatsu', 'Dkw-vemag', 'Dodge', 'Effa', 'Ego', 
  'Emis', 'Engesa', 'Envemo', 'Farus', 'Fercar Buggy', 'Ferrari', 'Fever', 'Fiat', 'Fnm', 'Ford', 
  'Fyber', 'Geely', 'Giants', 'Gmc', 'Gurgel', 'Gwm', 'Hafei', 'Honda', 'Hummer', 'Hyundai', 
  'Infiniti', 'International', 'Iveco', 'Jac', 'Jaecoo', 'Jaguar', 'Jeep', 'Jinbei', 'Jpx', 
  'Kaiser', 'Kia', 'Lada', 'Lamborghini', 'Land Rover', 'Lexus', 'Lifan', 'Lincoln', 'Lotus', 
  'Lucid', 'Mahindra', 'Marcopolo', 'Maserati', 'Matra', 'Mazda', 'Mclaren', 'Mercedes-benz', 
  'Mercury', 'Mg', 'Mini', 'Mitsubishi', 'Miura', 'Morgan', 'Morris', 'Mp Lafer', 'Mplm', 'Nash', 
  'Neta', 'Nissan', 'Oldsmobile', 'Omoda', 'Opel', 'Packard', 'Peugeot', 'Plymouth', 'Pontiac', 
  'Porsche', 'Puma', 'Ram', 'Renault', 'Rivian', 'Rolls-royce', 'Santa Matilde', 'Saturn', 'Seat', 
  'Seres', 'Shelby', 'Shineray', 'Smart', 'Ssangyong', 'Studebaker', 'Subaru', 'Suzuki', 'Tac', 
  'Tesla', 'Toyota', 'Troller', 'Volkswagen', 'Volvo', 'Wake', 'Way Brasil', 'Willys', 'Willys Overland', 'Zeekr'
];

// Definir as marcas para motos
export const motoBrands = [
  'Aima', 'Amazonas', 'Aprilia', 'Avelloz', 'Bajaj', 'Bashi', 'Benzhou', 'Bimota', 'Bmw', 'Buell', 
  'Bull', 'By Cristo', 'Cagiva', 'Can-am', 'Casa Do Triciclo', 'Cfmoto', 'Dafra', 'Ducati', 
  'Fun Motors', 'Fusco-motosegura', 'Fym', 'Gas Gas', 'Gloov', 'Goes', 'Goo', 'Haojue', 
  'Harley-davidson', 'Hisun', 'Honda', 'Husqvarna', 'Indian', 'Iros', 'Jincheng', 'Kasinski', 
  'Kawasaki', 'Ktm', 'Kymco', 'Lambretta', 'Linzhi', 'Mobyou', 'Moto Chefe', 'Moto Guzzi', 
  'Motocar', 'Motorino', 'Mottu', 'Ms Eletric', 'Muuv', 'Mv Agusta', 'Mxf', 'Niu', 'Piaggio', 
  'Polaris', 'Riguete', 'Royal Enfield', 'Sachs', 'Segway', 'Sherco', 'Shineray', 'Sundown', 
  'Super Soco', 'Suzuki', 'Traxx', 'Triumph', 'Ventane', 'Vespa', 'Voltz'
];

// Mapeamento de modelos por marca (simplificado para alguns exemplos)
export const modelsByBrand: Record<string, string[]> = {
  // Carros
  'Chevrolet': ['Onix', 'Prisma', 'Cruze', 'S10', 'Tracker', 'Cobalt', 'Spin', 'Montana'],
  'Fiat': ['Uno', 'Palio', 'Argo', 'Mobi', 'Strada', 'Toro', 'Cronos', 'Fiorino', 'Doblo'],
  'Volkswagen': ['Gol', 'Polo', 'Golf', 'Fox', 'Virtus', 'Jetta', 'Nivus', 'T-Cross', 'Amarok', 'Saveiro'],
  'Honda (Carro)': ['Civic', 'City', 'Fit', 'HR-V', 'WR-V', 'CR-V', 'Accord'],
  'Toyota': ['Corolla', 'Yaris', 'Etios', 'Hilux', 'SW4', 'RAV4', 'Camry', 'Prius'],
  
  // Motos
  'Kawasaki': ['Ninja 300', 'Ninja 400', 'Z400', 'Versys 650', 'Vulcan S', 'Z900', 'Z1000', 'Ninja ZX-10R'],
  'Honda (Moto)': ['CG 160', 'Bros 160', 'Biz 125', 'CB 500F', 'CB 650R', 'XRE 300', 'PCX 150', 'Elite 125'],
  'Yamaha': ['Factor 150', 'Fazer 250', 'MT-03', 'MT-07', 'MT-09', 'Crosser 150', 'Lander 250', 'NMAX 160'],
  'Suzuki': ['GSX-S750', 'V-Strom 650', 'Burgman 125', 'Hayabusa', 'Bandit 650', 'Intruder 125']
};

/**
 * Obtém as marcas disponíveis para um tipo específico de veículo
 * @param vehicleType Tipo do veículo
 * @returns Array com as marcas disponíveis
 */
export const getBrandsByVehicleType = (vehicleType: string): string[] => {
  // Verificar o tipo de veículo
  if (vehicleType.toLowerCase().includes('moto') || 
      vehicleType.toLowerCase() === 'bicicleta' || 
      vehicleType.toLowerCase() === 'ciclomotor') {
    return ['Todas', ...motoBrands];
  } else if (vehicleType.toLowerCase().includes('carro') || 
             vehicleType.toLowerCase() === 'caminhonete' || 
             vehicleType.toLowerCase() === 'pick-up' ||
             vehicleType.toLowerCase() === 'caminhão' ||
             vehicleType.toLowerCase() === 'van') {
    return ['Todas', ...carBrands];
  }
  
  // Para outros tipos de veículos ou quando o tipo não está especificado, retornar todas
  return ['Todas'];
};

/**
 * Obtém os modelos disponíveis para uma marca específica
 * @param brand Marca selecionada
 * @returns Array com os modelos disponíveis
 */
export const getModelsByBrand = (brand: string): string[] => {
  if (brand === 'todas' || !brand) {
    return ['Todos'];
  }
  
  // Verificar se a marca é Honda, que pode ser carro ou moto
  if (brand === 'Honda') {
    // Para Honda precisamos inferir qual é o tipo (carro ou moto)
    // Aqui podemos retornar ambos os conjuntos de modelos ou verificar pelo tipo de veículo
    // Uma solução simples é retornar todos os modelos Honda
    return ['Todos', ...modelsByBrand['Honda (Carro)'] || [], ...modelsByBrand['Honda (Moto)'] || []];
  }
  
  const models = modelsByBrand[brand];
  if (!models || models.length === 0) {
    return ['Todos']; // Retornar apenas "Todos" se não houver modelos específicos
  }
  
  return ['Todos', ...models];
};

/**
 * Obtém as marcas com base na categoria selecionada
 * @param category Categoria selecionada
 * @returns Array de marcas
 */
export const getBrandsByCategory = (category: string): string[] => {
  if (!category || category === '') {
    return [];
  }
  
  // Para categorias de veículos leves, retornar carros e motos
  if (category === 'Leves') {
    return ['Todas', ...carBrands, ...motoBrands];
  }
  
  // Para outras categorias, retornar marcas de acordo com o tipo
  switch (category) {
    case 'Aéreos':
      return ['Todas', 'Airbus', 'Boeing', 'Cessna', 'Embraer', 'Piper'];
    case 'Náuticos':
      return ['Todas', 'Bayliner', 'Boston Whaler', 'Intermarine', 'Jet Sea', 'Kawasaki', 'Sea Doo', 'Yamaha'];
    case 'Recreativos':
      return ['Todas', 'BRP', 'Caloi', 'Honda', 'Kawasaki', 'Polaris', 'Suzuki', 'Yamaha'];
    case 'Pesados':
      return ['Todas', 'DAF', 'Ford', 'Iveco', 'MAN', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Volvo'];
    case 'Máquinas Agrícolas':
      return ['Todas', 'Case', 'John Deere', 'Massey Ferguson', 'New Holland', 'Valtra'];
    case 'Máquinas de Construção':
      return ['Todas', 'Caterpillar', 'JCB', 'Komatsu', 'New Holland', 'Volvo'];
    default:
      return ['Todas'];
  }
};
