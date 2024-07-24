'use server';

import {singOut} from '@/auth.config';

export const logout = async() => {
    await singOut();
}