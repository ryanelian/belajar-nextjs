import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SubmitButton: React.FC<React.HTMLProps<HTMLButtonElement>> = (props) => {
    return (
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' {...props} type='submit'>
            <FontAwesomeIcon className='mr-2' icon={faChevronUp}></FontAwesomeIcon>
            Submit
        </button>
    );
}
