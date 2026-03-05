import React, { useState } from "react";
import { Plus, Check, ChevronDown } from "lucide-react";
import type { EventType } from "../../types/repertoire";

interface EventTypeSelectProps {
    selectedType: EventType;
    onSelect: (type: EventType) => void;
}

const DEFAULT_TYPES: EventType[] = ["Holy Mass", "Wedding", "Concert", "Funeral"];

const EventTypeSelect: React.FC<EventTypeSelectProps> = ({
    selectedType,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customType, setCustomType] = useState("");
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [availableTypes, setAvailableTypes] = useState(DEFAULT_TYPES);

    const handleSelect = (type: EventType) => {
        onSelect(type);
        setIsOpen(false);
    };

    const handleAddCustom = () => {
        if (customType.trim()) {
            const newType = customType.trim();
            setAvailableTypes([...availableTypes, newType]);
            onSelect(newType);
            setCustomType("");
            setIsAddingCustom(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Type
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-left"
            >
                <span className="block truncate text-gray-900 dark:text-white font-medium">
                    {selectedType || "Select an event type"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1">
                    {availableTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleSelect(type)}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            <span>{type}</span>
                            {selectedType === type && (
                                <Check className="w-4 h-4 text-red-600" />
                            )}
                        </button>
                    ))}

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1 p-2">
                        {!isAddingCustom ? (
                            <button
                                onClick={() => setIsAddingCustom(true)}
                                className="w-full flex items-center space-x-2 px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Custom Event...</span>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={customType}
                                    onChange={(e) => setCustomType(e.target.value)}
                                    placeholder="Enter event name..."
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 outline-none bg-transparent text-gray-900 dark:text-white"
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                                />
                                <button
                                    onClick={handleAddCustom}
                                    disabled={!customType.trim()}
                                    className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventTypeSelect;
