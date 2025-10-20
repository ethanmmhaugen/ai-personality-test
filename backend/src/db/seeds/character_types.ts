import db from '../connection';

interface CharacterType {
  name: string;
  theme: string;
  description: string;
  workStyleStrengths: string;
  interpersonalDynamics: string;
  imageUrl: string;
  traitProfile: Record<string, number>;
}

const fantasyCharacters: CharacterType[] = [
  {
    name: 'The Arcane Scholar',
    theme: 'fantasy',
    description:
      'A master of ancient knowledge and mystical arts. You thrive in quiet libraries and solitary research, uncovering secrets through careful study and deep focus.',
    workStyleStrengths:
      'Exceptional at independent research, detailed analysis, and long-term focused projects. Excels in roles requiring deep expertise and careful attention to detail.',
    interpersonalDynamics:
      'Prefers working alone or in small, quiet groups. Values intellectual depth over social breadth. Best paired with supporters who respect their need for concentration.',
    imageUrl: 'https://placeholder.com/scholar.png',
    traitProfile: { F: 90, I: 85, S: 70, G: 75, E: 40, N: 30, A: 95, D: 60 },
  },
  {
    name: 'The Dragon Rider',
    theme: 'fantasy',
    description:
      'A bold adventurer who soars above challenges with courage and independence. You forge your own path and inspire others through daring action.',
    workStyleStrengths:
      'Natural leader in high-stakes situations. Excels at independent decision-making, taking calculated risks, and driving projects forward with determination.',
    interpersonalDynamics:
      'Commands respect but may intimidate. Works best with confident peers. Values autonomy and direct communication over consensus-building.',
    imageUrl: 'https://placeholder.com/dragon-rider.png',
    traitProfile: { F: 75, I: 90, S: 50, G: 40, E: 85, N: 50, A: 60, D: 95 },
  },
  {
    name: 'The Grove Keeper',
    theme: 'fantasy',
    description:
      'A patient guardian of nature who understands the slow rhythms of growth and cycles. You bring stability and nurturing wisdom to any endeavor.',
    workStyleStrengths:
      'Exceptional at maintaining stable systems, providing consistent support, and creating harmonious environments. Thrives in roles requiring patience and care.',
    interpersonalDynamics:
      'Natural peacemaker and supporter. Creates safe, nurturing team environments. Values harmony and long-term relationships over quick wins.',
    imageUrl: 'https://placeholder.com/grove-keeper.png',
    traitProfile: { F: 60, I: 45, S: 85, G: 95, E: 35, N: 70, A: 55, D: 40 },
  },
  {
    name: 'The Storm Caller',
    theme: 'fantasy',
    description:
      'A force of nature who channels raw energy into transformative action. You bring intensity, innovation, and unpredictable brilliance to every challenge.',
    workStyleStrengths:
      'Excellent at brainstorming, creative problem-solving, and energizing teams. Thrives in dynamic, fast-paced environments requiring innovation.',
    interpersonalDynamics:
      'Highly energetic and inspiring but may overwhelm quieter teammates. Best in diverse, adaptive teams that appreciate spontaneity.',
    imageUrl: 'https://placeholder.com/storm-caller.png',
    traitProfile: { F: 50, I: 60, S: 45, G: 30, E: 95, N: 85, A: 65, D: 80 },
  },
  {
    name: 'The Shadow Walker',
    theme: 'fantasy',
    description:
      'A strategic observer who sees what others miss. You excel at gathering intelligence, working behind the scenes, and executing precise plans.',
    workStyleStrengths:
      'Master of detailed reconnaissance, strategic planning, and independent execution. Excels in roles requiring discretion and careful observation.',
    interpersonalDynamics:
      'Prefers observing to leading. Works best with minimal social interaction. Values competence and efficiency over emotional connection.',
    imageUrl: 'https://placeholder.com/shadow-walker.png',
    traitProfile: { F: 85, I: 90, S: 80, G: 60, E: 50, N: 25, A: 90, D: 70 },
  },
  {
    name: 'The Bard of the Realm',
    theme: 'fantasy',
    description:
      'A charismatic storyteller who weaves connections through creativity and charm. You bring people together and inspire through words and performance.',
    workStyleStrengths:
      'Outstanding communicator, relationship builder, and creative collaborator. Excels in roles requiring presentation, negotiation, and team motivation.',
    interpersonalDynamics:
      'Thrives in highly social environments. Natural networker and team energizer. Creates strong emotional bonds and collaborative atmospheres.',
    imageUrl: 'https://placeholder.com/bard.png',
    traitProfile: { F: 45, I: 35, S: 55, G: 50, E: 90, N: 95, A: 50, D: 65 },
  },
  {
    name: 'The Battle Tactician',
    theme: 'fantasy',
    description:
      'A strategic mind who approaches challenges like chess matches. You analyze, plan, and execute with precision, leading teams to victory through careful coordination.',
    workStyleStrengths:
      'Exceptional strategic planner and team coordinator. Excels at analyzing complex situations, creating detailed plans, and optimizing team performance.',
    interpersonalDynamics:
      'Balances analytical thinking with team collaboration. Respected for competence. Best with teams that value structure and clear objectives.',
    imageUrl: 'https://placeholder.com/tactician.png',
    traitProfile: { F: 80, I: 55, S: 75, G: 70, E: 60, N: 65, A: 95, D: 85 },
  },
  {
    name: 'The Wandering Alchemist',
    theme: 'fantasy',
    description:
      'An experimental inventor who combines curiosity with practical knowledge. You explore new possibilities while maintaining a grounded approach to discovery.',
    workStyleStrengths:
      'Excellent at R&D, experimentation, and practical innovation. Balances creative exploration with hands-on implementation.',
    interpersonalDynamics:
      'Comfortable working alone or in small collaborative groups. Values shared curiosity and practical results over social rituals.',
    imageUrl: 'https://placeholder.com/alchemist.png',
    traitProfile: { F: 70, I: 75, S: 90, G: 55, E: 85, N: 45, A: 80, D: 60 },
  },
  {
    name: 'The Crystal Sage',
    theme: 'fantasy',
    description:
      'A wise advisor who brings clarity and insight through contemplation. You excel at seeing patterns, providing guidance, and maintaining perspective.',
    workStyleStrengths:
      'Outstanding advisor, mentor, and strategic thinker. Excels in roles requiring wisdom, pattern recognition, and long-term vision.',
    interpersonalDynamics:
      'Calm, balanced presence. Effective one-on-one mentor. Creates thoughtful, reflective team cultures. Values depth over breadth in relationships.',
    imageUrl: 'https://placeholder.com/sage.png',
    traitProfile: { F: 75, I: 70, S: 60, G: 80, E: 55, N: 60, A: 90, D: 50 },
  },
  {
    name: 'The Guild Master',
    theme: 'fantasy',
    description:
      'A master organizer who builds and leads thriving communities. You excel at creating structure, fostering collaboration, and achieving ambitious collective goals.',
    workStyleStrengths:
      'Exceptional project manager and team builder. Excels at organization, delegation, and driving group achievement. Natural leader of collaborative efforts.',
    interpersonalDynamics:
      'Highly social and organizationally minded. Builds strong networks and team cohesion. Values both results and relationships equally.',
    imageUrl: 'https://placeholder.com/guild-master.png',
    traitProfile: { F: 70, I: 40, S: 70, G: 75, E: 65, N: 90, A: 75, D: 90 },
  },
  {
    name: 'The Wild Shaman',
    theme: 'fantasy',
    description:
      'A free spirit who channels primal energy and intuitive wisdom. You trust instinct, embrace spontaneity, and find innovative solutions through unconventional means.',
    workStyleStrengths:
      'Exceptional creative thinking and intuitive problem-solving. Thrives in unstructured environments. Brings fresh perspectives and breakthrough ideas.',
    interpersonalDynamics:
      'Energizing but unpredictable. Best in creative, adaptive teams. May clash with rigid structures. Values authenticity and freedom.',
    imageUrl: 'https://placeholder.com/shaman.png',
    traitProfile: { F: 40, I: 80, S: 35, G: 30, E: 95, N: 55, A: 45, D: 70 },
  },
  {
    name: 'The Royal Diplomat',
    theme: 'fantasy',
    description:
      'A skilled negotiator who builds bridges between opposing forces. You combine social grace with strategic thinking to create win-win solutions.',
    workStyleStrengths:
      'Outstanding negotiator, mediator, and relationship manager. Excels at stakeholder management, conflict resolution, and building consensus.',
    interpersonalDynamics:
      'Highly socially intelligent. Creates inclusive, collaborative environments. Balances empathy with strategic goal achievement.',
    imageUrl: 'https://placeholder.com/diplomat.png',
    traitProfile: { F: 65, I: 45, S: 65, G: 70, E: 70, N: 90, A: 75, D: 75 },
  },
];

export async function seedCharacterTypes(): Promise<void> {
  console.log('Seeding character types...');

  try {
    for (const character of fantasyCharacters) {
      await db.query(
        `
        INSERT INTO character_types (name, theme, description, work_style_strengths, interpersonal_dynamics, image_url, trait_profile)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (name, theme) DO UPDATE
        SET description = EXCLUDED.description,
            work_style_strengths = EXCLUDED.work_style_strengths,
            interpersonal_dynamics = EXCLUDED.interpersonal_dynamics,
            image_url = EXCLUDED.image_url,
            trait_profile = EXCLUDED.trait_profile,
            updated_at = CURRENT_TIMESTAMP
      `,
        [
          character.name,
          character.theme,
          character.description,
          character.workStyleStrengths,
          character.interpersonalDynamics,
          character.imageUrl,
          JSON.stringify(character.traitProfile),
        ]
      );
    }

    console.log(`✓ Seeded ${fantasyCharacters.length} fantasy character types`);
  } catch (error) {
    console.error('Error seeding character types:', error);
    throw error;
  }
}

export default seedCharacterTypes;

