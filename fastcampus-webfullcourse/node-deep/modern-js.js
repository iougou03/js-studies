// @ts-check

/**
 * modern style 1: functional programming
 *
 * Question A: Get cities if at least one person under 30 live in the city
 */

const people = [
  {
    age: 23,
    city: 'Seoul',
    pet: 'cat',
  },
];
function solveA() {
  /**
   * @type {string[]}
   */
  const cities = [];

  for (const person of people) {
    if (person.age < 30 && !cities.find((city) => person.city === city)) {
      cities.push(person.city);
    }
  }

  return cities;
}

console.log('Solve A', solveA());

function solveModernA() {
  const allCities = people.filter((person) => person.age < 30);

  const set = new Set(allCities);

  return Array.from(set);
}

console.log('Solve modern style A', solveModernA);

/**
 * Question B: Get the map of people for each city who has a pet
 */

/** @typedef { Record<string, Object<string, number>> } PetsOfCities */

function solveB() {
  /** @type PetsOfCities */
  const result = {};

  for (const person of people) {
    const { city, pet: petOrPets } = person;

    if (petOrPets) {
      if (typeof petOrPets === 'string') {
      }
    }
  }
}
