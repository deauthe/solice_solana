import React from "react";
import CreateForm from "@/components/Create/CreateForm";
import CreateCandyMachineForm from "@/components/Create/CreateCandyMachineForm";
import Hero from "@/components/Hero/Hero";
type Props = {};

const CreatePage = (props: Props) => {
	return (
		<div className="bg-black px-20">
			<CreateCandyMachineForm />
			<br />
			<CreateForm />
		</div>
	);
};
export default CreatePage;
