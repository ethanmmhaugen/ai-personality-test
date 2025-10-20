import db from '../connection';

interface TraitDimension {
  code: string;
  name: string;
  description: string;
  display_order: number;
}

const traitDimensions: TraitDimension[] = [
  {
    code: 'F',
    name: 'Focused',
    description:
      'Measures ability to concentrate on specific tasks and maintain attention. High scorers excel at deep work and detail-oriented tasks.',
    display_order: 1,
  },
  {
    code: 'I',
    name: 'Independence',
    description:
      'Measures preference for autonomous work versus collaborative environments. High scorers thrive working independently.',
    display_order: 2,
  },
  {
    code: 'S',
    name: 'Sensing',
    description:
      'Measures reliance on concrete facts versus abstract intuition. High scorers prefer practical, hands-on approaches.',
    display_order: 3,
  },
  {
    code: 'G',
    name: 'Grounded',
    description:
      'Measures preference for stability and routine versus spontaneity. High scorers value consistency and predictability.',
    display_order: 4,
  },
  {
    code: 'E',
    name: 'Exploratory',
    description:
      'Measures openness to new experiences and creative thinking. High scorers embrace innovation and experimentation.',
    display_order: 5,
  },
  {
    code: 'N',
    name: 'Network',
    description:
      'Measures social energy and collaboration preference. High scorers thrive in team environments and value relationships.',
    display_order: 6,
  },
  {
    code: 'A',
    name: 'Analytical',
    description:
      'Measures logical reasoning and systematic thinking. High scorers excel at problem-solving and data analysis.',
    display_order: 7,
  },
  {
    code: 'D',
    name: 'Driven',
    description:
      'Measures ambition, goal-orientation, and competitive spirit. High scorers are motivated by achievement and results.',
    display_order: 8,
  },
];

export async function seedTraitDimensions(): Promise<void> {
  console.log('Seeding trait dimensions...');

  try {
    for (const trait of traitDimensions) {
      await db.query(
        `
        INSERT INTO trait_dimensions (code, name, description, display_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (code) DO UPDATE
        SET name = EXCLUDED.name,
            description = EXCLUDED.description,
            display_order = EXCLUDED.display_order,
            updated_at = CURRENT_TIMESTAMP
      `,
        [trait.code, trait.name, trait.description, trait.display_order]
      );
    }

    console.log(`✓ Seeded ${traitDimensions.length} trait dimensions`);
  } catch (error) {
    console.error('Error seeding trait dimensions:', error);
    throw error;
  }
}

export default seedTraitDimensions;

