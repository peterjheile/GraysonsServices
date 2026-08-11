import 'server-only';

import { fetchApi } from '@/lib/api/server';

import {
  serviceNamesSchema,
  servicesSchema,
  type ServiceNames,
  type Services,
} from './types';

const SERVICES_CACHE = {
  revalidate: 300,
  tags: ['services'],
} as const;

export function fetchServiceNames(): Promise<ServiceNames> {
  return fetchApi(
    '/api/services/names/',
    serviceNamesSchema,
    SERVICES_CACHE,
  );
}

export function fetchServices(): Promise<Services> {
  return fetchApi(
    '/api/services/',
    servicesSchema,
    SERVICES_CACHE,
  );
}

export async function getServiceNames(): Promise<ServiceNames> {
  try {
    return await fetchServiceNames();
  } catch (error) {
    console.error(
      'Unable to load service names; hiding optional service lists.',
      error,
    );

    return [];
  }
}

export function getServices(): Promise<Services> {
  return fetchServices();
}