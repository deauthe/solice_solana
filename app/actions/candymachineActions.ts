// app/actions/candyMachineActions.js

"use server";

import { PublicKey } from "@metaplex-foundation/umi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AddCandymachineProps {
	address: PublicKey;
	wallet: PublicKey;
	machineName: string;
	artistName: string;
}
export async function addCandyMachine({
	address,
	wallet,
	machineName,
	artistName,
}: AddCandymachineProps) {
	if (!wallet || !machineName || !artistName || !address) {
		throw new Error("All fields are required");
	}

	try {
		const newCandyMachine = await prisma.candyMachine.create({
			data: {
				address,
				wallet,
				machineName,
				artistName,
			},
		});
		return newCandyMachine;
	} catch (error) {
		throw new Error(`Failed to create candy machine: ${error}`);
	}
}

export async function fetchAllCandyMachinesFromDb() {
	try {
		const candyMachines = await prisma.candyMachine.findMany();
		return candyMachines;
	} catch (error) {
		throw new Error(`Failed to fetch candy machines: ${error}`);
	}
}

export async function fetchCandyMachineByWallet(wallet: PublicKey) {
	try {
		const candyMachines = await prisma.candyMachine.findMany({
			where: {
				wallet,
			},
		});

		if (!candyMachines) {
			throw new Error("Candy Machine not found");
		}

		return candyMachines;
	} catch (error) {
		throw new Error(`Failed to fetch candy machine: ${error}`);
	}
}
