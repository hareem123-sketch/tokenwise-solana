

// src/entities/Transaction.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  walletAddress!: string;

  @Column({ type: 'varchar' })
  type!: 'buy' | 'sell';

  @Column({ type: 'varchar' })
  protocol!: string;

  @Column('decimal')
  amount!: number;

  @Column()
  timestamp!: Date;
}
