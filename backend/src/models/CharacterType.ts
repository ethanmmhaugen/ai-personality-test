import { CharacterType as ICharacterType } from '../../../shared/types/quiz';
import db from '../db/connection';

export class CharacterType {
  static async findAll(theme?: string): Promise<ICharacterType[]> {
    const query = theme
      ? `SELECT id, name, theme, description, work_style_strengths as "workStyleStrengths",
                interpersonal_dynamics as "interpersonalDynamics", image_url as "imageUrl",
                trait_profile as "traitProfile", created_at as "createdAt", updated_at as "updatedAt"
         FROM character_types
         WHERE theme = $1
         ORDER BY name`
      : `SELECT id, name, theme, description, work_style_strengths as "workStyleStrengths",
                interpersonal_dynamics as "interpersonalDynamics", image_url as "imageUrl",
                trait_profile as "traitProfile", created_at as "createdAt", updated_at as "updatedAt"
         FROM character_types
         ORDER BY name`;

    const params = theme ? [theme] : [];
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<ICharacterType | null> {
    const result = await db.query(
      `SELECT id, name, theme, description, work_style_strengths as "workStyleStrengths",
              interpersonal_dynamics as "interpersonalDynamics", image_url as "imageUrl",
              trait_profile as "traitProfile", created_at as "createdAt", updated_at as "updatedAt"
       FROM character_types
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByTheme(theme: string): Promise<ICharacterType[]> {
    return this.findAll(theme);
  }
}

export default CharacterType;

