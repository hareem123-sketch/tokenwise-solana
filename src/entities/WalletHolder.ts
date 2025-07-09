// src/entities/WalletHolder.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WalletHolder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  walletAddress: string;

  @Column()
  amount: number;

  @Column()
  tokenMint: string;
}
