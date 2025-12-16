# react-file-router

Lightweight file-based router for Vite + React Router DOM, like Next.js.

## Installation
npm install my-file-router

## Usage
import { FileRouter } from 'react-file-router';

const pagesGlob = import.meta.glob('/src/pages/**');

<FileRouter routes={pagesGlob} />
