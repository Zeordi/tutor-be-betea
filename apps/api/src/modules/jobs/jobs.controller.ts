import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  createJob(@CurrentUser() user: any, @Body() body: any) {
    return this.jobsService.createJob(user.id, body);
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  listMine(@CurrentUser() user: any) {
    return this.jobsService.listJobsForParent(user.id);
  }

  @Get("open")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  listOpen() {
    return this.jobsService.listOpenJobs();
  }

  @Get("applications/mine")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  myApplications(@CurrentUser() user: any) {
    return this.jobsService.listMyApplications(user.id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getJobById(@Param("id") id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post(":jobId/apply")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  applyToJob(
    @CurrentUser() user: any,
    @Param("jobId") jobId: string,
    @Body() body: { coverNote?: string },
  ) {
    return this.jobsService.applyToJob(user.id, jobId, body?.coverNote);
  }
}