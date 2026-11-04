"use client";

import * as React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';


interface Benchmark {
    operation: string;
    count: string;
    prove: string;
    verify: string;
    proofSize: string;
}

interface BenchmarkTableProps {
    benchmarksExpected: string[];
}

const DATA_URL = 'https://benchmark.binius.xyz/result.json';
const CATEGORIES = ['trace-gen-time-multi-thread', 'trace-gen-time-single-thread', 'prove-time-multi-thread', 'prove-time-single-thread', 'verify-time-multi-thread', 'verify-time-single-thread', 'proof-size'];
const VALID_PROCESSED_CATEGORIES = ['trace-gen-time', 'prove-time', 'verify-time', 'proof-size', 'n_ops'];

const millisecondsToSeconds = (ms: number) => (ms / 1000.0).toFixed(2);

const validateData = (data: Record<string, Record<string, string>>) => {
    if (Object.keys(data).length === 0) {
        throw new Error('Invalid data: no data found');
    }

    Object.entries(data).forEach(([operation, categories]) => {
        const invalidCategories = Object.keys(categories).filter(cat => !VALID_PROCESSED_CATEGORIES.includes(cat));
        if (invalidCategories.length > 0) {
            throw new Error(`Invalid data: ${operation} contains invalid categories: ${invalidCategories.join(', ')}`);
        }
        if (Object.keys(categories).length !== 5) {
            throw new Error(`Invalid data: ${operation} has ${Object.keys(categories).length} categories, expected 5`);
        }
    });
};

const fetchAndProcessData = async (benchmarksExpected: string[]): Promise<Benchmark[]> => {
    try {
        const { data } = await axios.get(DATA_URL);
        const benchmarks: Record<string, Record<string, string>> = {};

        Object.entries(data).forEach(([key, value]: [string, any]) => {
            const [_, operation, num_ops] = key.split(' / ');
            if (!benchmarksExpected.includes(operation)) return;

            for (const category_key of Object.keys(value)) {
                if (!CATEGORIES.includes(category_key)) {
                    // Ignore unknown categories
                    continue;
                }

                const latencyValue = value[category_key].value;
                if (typeof latencyValue !== 'number') {
                    throw new Error(`Invalid data: ${operation}::${category_key} is not a number`);
                }

                let operation_name = category_key.endsWith('-single-thread') ? `${operation} (single-threaded)` : operation;

                if (!benchmarks[operation_name]) {
                    benchmarks[operation_name] = {
                        n_ops: num_ops,
                        "proof-size": value['proof-size'].value
                    };
                }

                let category_key_non_threading = category_key.endsWith('-single-thread') ? category_key.replace('-single-thread', '') : category_key.endsWith('-multi-thread') ? category_key.replace('-multi-thread', '') : category_key;

                benchmarks[operation_name][category_key_non_threading] = category_key.startsWith('verify-time')
                    ? latencyValue.toFixed(2)
                    : category_key.startsWith('prove-time')
                        ? millisecondsToSeconds(latencyValue)
                        : category_key.startsWith('trace-gen-time')
                            ? millisecondsToSeconds(latencyValue)
                            : latencyValue.toString();
            }

        });

        validateData(benchmarks);

        return Object.entries(benchmarks).map(([operation, data]) => ({
            operation,
            count: data['n_ops'],
            prove: `${data['trace-gen-time']} + ${data['prove-time']}`,
            verify: data['verify-time'],
            proofSize: data['proof-size']
        }));
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            throw new Error(`Failed to fetch benchmark data: ${error.message}`);
        }
        console.error('Error fetching benchmark data:', error);
        throw error;
    }
};

// Component
const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ benchmarksExpected }) => {
    const [benchmarks, setBenchmarks] = useState<Benchmark[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAndProcessData(benchmarksExpected)
            .then(setBenchmarks)
            .catch(err => setError(err.message));
    }, [benchmarksExpected]);

    if (error) return <div>Error loading benchmarks: {error}</div>;
    if (!benchmarks) return <div>Loading...</div>;

    return (
        <div data-v-table-wrapper>
            <table data-v="">
                <thead>
                    <tr>
                        <th>Operation</th>
                        <th>Count</th>
                        <th>Prove (s)</th>
                        <th>Verify (ms)</th>
                        <th>Proof Size (KiB)</th>
                    </tr>
                </thead>
                <tbody>
                    {benchmarks.map((row, index) => (
                        <tr key={index}>
                            <td>{row.operation}</td>
                            <td>{row.count}</td>
                            <td>{row.prove}</td>
                            <td>{row.verify}</td>
                            <td>{row.proofSize}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BenchmarkTable;