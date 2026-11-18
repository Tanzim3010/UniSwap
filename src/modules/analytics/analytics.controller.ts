import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";
import { AnalyticsService } from "./analytics.service";



@Controller('admin/statistics')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AnalyticsController {
    constructor (
        private readonly anlyticsService: AnalyticsService,
    ) {}

    @Get()
    getStatistics() {
        return this.anlyticsService.getStatics();
    }
}