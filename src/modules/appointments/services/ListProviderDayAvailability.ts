import { inject, injectable } from 'tsyringe';
// import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// import AppError from '@shared/errors/AppError';
// import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  provider_id: string;
  day: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    return [{ hour: 8, available: true }];
  }
}

export default ListProviderMonthAvailabilityService;
