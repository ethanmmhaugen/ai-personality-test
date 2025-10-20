import seedTraitDimensions from './seeds/trait_dimensions';
import seedCharacterTypes from './seeds/character_types';

async function runSeeds() {
  console.log('Starting database seeding...');

  try {
    await seedTraitDimensions();
    await seedCharacterTypes();

    console.log('\n✓ All seeds completed successfully!');
  } catch (error) {
    console.error('\n✗ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeds if called directly
if (require.main === module) {
  runSeeds()
    .then(() => {
      console.log('Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export default runSeeds;

