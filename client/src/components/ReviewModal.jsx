import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid'
import { toastProps } from './Utils/utils';

function ReviewModal({ isOpen, onClose, onAddReview, defaultValueText, defaultValueStars, toast}) {
    const [newReview, setNewReview] = useState(defaultValueText || '');
    const [stars, setStars] = useState(defaultValueStars || 0);

    const handleAddReview = () => {
        if (newReview === undefined) {
            toast.error('Review cannot be empty', toastProps);
            return;
        }
        if(stars === 0) {
            toast.error('Enter a valid value for stars.', toastProps);
            return;
        }
        onAddReview({ text: newReview, stars });
        setNewReview('');
        setStars(0);
        onClose();
    };

    useEffect(() => {
        setNewReview(defaultValueText);
        setStars(defaultValueStars);
    }, [defaultValueStars, defaultValueText]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className='fixed z-10 inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
                    <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                </div>

                <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
                    &#8203;
                </span>

                <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                    <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder={newReview === '' ? 'Write your review here...' : newReview}
                            className='w-full h-20 p-2 border border-gray-300 rounded'
                        />
                        <div className='flex flex-row mt-2'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    onClick={() => setStars(star)}
                                    className={`h-8 w-8 ${star <= stars ? 'text-yellow-500' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                        <button
                            onClick={handleAddReview}
                            className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'>
                            Add review
                        </button>
                        <button
                            onClick={onClose}
                            className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal;