import { pgTable, uuid, varchar, decimal, timestamp, text, pgEnum, index } from 'drizzle-orm/pg-core'

// meal_type ENUM
export const mealTypeEnum = pgEnum('meal_type_enum', ['breakfast', 'lunch', 'dinner'])

// usersテーブル
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 50 }),
  targetWeight: decimal('target_weight', { precision: 4, scale: 1 }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
})

// weight_recordsテーブル
export const weightRecords = pgTable('weight_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  weight: decimal('weight', { precision: 4, scale: 1 }).notNull(),
  fat: decimal('fat', { precision: 3, scale: 1 }),
  date: timestamp('date', { withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
}, (table) => ({
  userIdIdx: index('idx_weight_records_user_id').on(table.userId),
  dateIdx: index('idx_weight_records_date').on(table.date),
}))

// daily_mealsテーブル
export const dailyMeals = pgTable('daily_meals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date', { withTimezone: true, mode: 'string' }).notNull(),
  mealType: mealTypeEnum('meal_type').notNull(),
  mealMemo: text('meal_memo'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
}, (table) => ({
  userIdIdx: index('idx_daily_meals_user_id').on(table.userId),
  dateIdx: index('idx_daily_meals_date').on(table.date),
}))

// 型定義をエクスポート
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type WeightRecord = typeof weightRecords.$inferSelect
export type NewWeightRecord = typeof weightRecords.$inferInsert

export type DailyMeal = typeof dailyMeals.$inferSelect
export type NewDailyMeal = typeof dailyMeals.$inferInsert