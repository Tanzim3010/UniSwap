import{Controller,Get}from"@nestjs/common";
import{AnalyticsService}from"./analytics.service";



@Controller('admin/statistics')
export class AnalyticsController {
    constructor (
        private readonly anlyticsService: AnalyticsService,
    ) {}

    @Get()
    getStatistics() {
        return this.anlyticsService.getStatics();
    }
}