import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({modelName: "zuk", tableName: "zuk2", timestamps: false})
class Word extends Model {
  @Column({type: DataType.INTEGER, primaryKey: true})
  declare id: number;

  @Column(DataType.STRING)
  declare word_tr: string;

  @Column(DataType.STRING)
  declare desc_ru: string;
};

export {Word as Word};