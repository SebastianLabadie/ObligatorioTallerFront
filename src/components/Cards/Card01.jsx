import React from "react";

export default function Card01({title, description,maxWidth='max-w-sm', children}) {
	return (
		<div className="flex justify-center mx-3">
			<div className={`block ${maxWidth} rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-700`}>
				<h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">{title}</h5>
				<p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
					{description}
				</p>
				{children}
			</div>
		</div>
	);
}
