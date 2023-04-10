export const FormControl: React.FC<React.HTMLProps<HTMLInputElement>> = (props) => {
    return (
        <input
            className='mt-1 px-2 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            {...props}></input>
    );
}
