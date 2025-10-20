import { TraitDimension as ITraitDimension, TraitScores } from '../../../shared/types/quiz';
import db from '../db/connection';

export class TraitDimension {
  static async findAll(): Promise<ITraitDimension[]> {
    const result = await db.query(
      `SELECT id, code, name, description, display_order as "displayOrder",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM trait_dimensions
       ORDER BY display_order`
    );
    return result.rows;
  }

  static async findByCode(code: keyof TraitScores): Promise<ITraitDimension | null> {
    const result = await db.query(
      `SELECT id, code, name, description, display_order as "displayOrder",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM trait_dimensions
       WHERE code = $1`,
      [code]
    );
    return result.rows[0] || null;
  }
}

export default TraitDimension;

