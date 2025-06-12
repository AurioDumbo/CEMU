import React from 'react';

export default function Modal({ isOpen, onClose, title, message, type = 'success', onConfirm }) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ),
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          icon: (
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          icon: null,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 transition-opacity"></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${styles.bgColor} mb-4`}>
            {styles.icon}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {message}
            </p>
            
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
              >
                Cancelar
              </button>
              {onConfirm && (
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${styles.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                >
                  Confirmar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}