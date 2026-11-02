import { ensureDatabaseInitialized } from '../utils/database-init'

export default defineEventHandler((event) => ensureDatabaseInitialized(event))
