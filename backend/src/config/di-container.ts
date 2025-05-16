import { container } from "tsyringe";
import { TOKENS } from "./tokens";

import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { AdminRepository } from "../repositories/admin.repository";

import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";

import { IVendorRepository } from "../repositories/interfaces/IVendorRepository";
import { VendorRepository } from "../repositories/vendor.repository";

import { IVenueRepository } from "../repositories/interfaces/IVenueRepository";
import { VenueRepository } from "../repositories/venue.repository";

import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { BookingRepository } from "../repositories/booking.repository";

import { IBlockedDateRepository } from "../repositories/interfaces/IBlockedDateRepository";
import { BlockedDateRepository } from "../repositories/blockedDate.repository";

import { IMessageRepository } from "../repositories/interfaces/IMessageReposiotry";
import { MessageRepository } from "../repositories/message.repository";

import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";
import { NotificationRepository } from "../repositories/notification.repository";

import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";
import { ReviewRepository } from "../repositories/review.repository";

import { IAdminService } from "../services/interfaces/IAdminService";
import { AdminService } from "../services/admin.service";

import { IUserService } from "../services/interfaces/IUserService";
import { UserService } from "../services/user.service";

import { IVendorService } from "../services/interfaces/IVendorService";
import { VendorService } from "../services/vendor.service";

import { IVenueService } from "../services/interfaces/IVenueService";
import { VenueService } from "../services/venue.service";

import { IBookingService } from "../services/interfaces/IBookingService";
import { BookingService } from "../services/booking.service";

import { IChatService } from "../services/interfaces/IChatService";
import { ChatService } from "../services/chat.service";

import { INotificationService } from "../services/interfaces/INotificationService";
import { NotificationService } from "../services/notification.service";

import { IReviewService } from "../services/interfaces/IReviewService";
import { ReviewService } from "../services/review.service";

import { AdminController } from "../controllers/admin.controller";
import { UserController } from "../controllers/user.controller";
import { VendorController } from "../controllers/vendor.controller";
import { VenueController } from "../controllers/venue.controller";
import { BookingController } from "../controllers/booking.controller";
import { ChatController } from "../controllers/chat.controller";
import { NotificationController } from "../controllers/notification.controller";
import { ReviewController } from "../controllers/review.controller";

container.register<IAdminRepository>(TOKENS.IAdminRepository, {
  useClass: AdminRepository,
});
container.register<IUserRepository>(TOKENS.IUserRepository, {
  useClass: UserRepository,
});
container.register<IVendorRepository>(TOKENS.IVendorRepository, {
  useClass: VendorRepository,
});
container.register<IVenueRepository>(TOKENS.IVenueRepository, {
  useClass: VenueRepository,
});
container.register<IBookingRepository>(TOKENS.IBookingRepository, {
  useClass: BookingRepository,
});
container.register<IBlockedDateRepository>(TOKENS.IBlockedDateRepository, {
  useClass: BlockedDateRepository,
});
container.register<IMessageRepository>(TOKENS.IMessageRepository, {
  useClass: MessageRepository,
});
container.register<INotificationRepository>(TOKENS.INotificationRepository, {
  useClass: NotificationRepository,
});
container.register<IReviewRepository>(TOKENS.IReviewRepository, {
  useClass: ReviewRepository,
});

container.register<IAdminService>(TOKENS.IAdminService, {
  useClass: AdminService,
});
container.register<IUserService>(TOKENS.IUserService, {
  useClass: UserService,
});
container.register<IVendorService>(TOKENS.IVendorService, {
  useClass: VendorService,
});
container.register<IVenueService>(TOKENS.IVenueService, {
  useClass: VenueService,
});
container.register<IBookingService>(TOKENS.IBookingService, {
  useClass: BookingService,
});
container.register<IChatService>(TOKENS.IChatService, {
  useClass: ChatService,
});
container.register<INotificationService>(TOKENS.INotificationService, {
  useClass: NotificationService,
});
container.register<IReviewService>(TOKENS.IReviewService, {
  useClass: ReviewService,
});

container.register(AdminController, { useClass: AdminController });
container.register(UserController, { useClass: UserController });
container.register(VendorController, { useClass: VendorController });
container.register(VenueController, { useClass: VenueController });
container.register(BookingController, { useClass: BookingController });
container.register(ChatController, { useClass: ChatController });
container.register(NotificationController, {
  useClass: NotificationController,
});
container.register(ReviewController, { useClass: ReviewController });
