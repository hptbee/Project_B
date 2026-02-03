using Microsoft.EntityFrameworkCore;
using TheCoffeeCream.Domain.Entities;

namespace TheCoffeeCream.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Shop> Shops { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<SubscriptionHistory> SubscriptionHistories { get; set; }
        public DbSet<Plan> Plans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Shop Configuration
            modelBuilder.Entity<Shop>(entity =>
            {
                entity.ToTable("Shop");
                entity.HasKey(e => e.Id);
            });

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Username).HasColumnName("username");
            });

            // Category Configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Category");
                entity.HasKey(e => e.Id);
                entity.HasOne<Shop>()
                    .WithMany()
                    .HasForeignKey(e => e.ShopId);
            });

            // Product Configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Product");
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne<Shop>()
                    .WithMany()
                    .HasForeignKey(e => e.ShopId);

                entity.Property(e => e.Cost).HasPrecision(18, 2);
                entity.Property(e => e.Price).HasPrecision(18, 2);

                // Ignore Toppings collection for now as it's handled by ToppingMapping string in current schema
                // or we could map it as a join table if we want a full migration.
                // Given the current Dapper logic expects ToppingMapping string, we keep it as is.
                entity.Ignore(e => e.Toppings);
            });

            // Order Configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("Order");
                entity.HasKey(e => e.Id);
                entity.HasMany(e => e.Items)
                    .WithOne(i => i.Order)
                    .HasForeignKey(i => i.OrderId);
                
                entity.Ignore(e => e.SubTotal);
                entity.Ignore(e => e.DiscountAmount);
                entity.Ignore(e => e.Total);

                entity.Property(e => e.OrderType).HasConversion<string>();
                entity.Property(e => e.PaymentMethod).HasConversion<string>();
                entity.Property(e => e.DiscountType).HasConversion<string>();
                entity.Property(e => e.Status).HasConversion<string>();

                entity.Property(e => e.CashAmount).HasPrecision(18, 2);
                entity.Property(e => e.TransferAmount).HasPrecision(18, 2);
                entity.Property(e => e.DiscountValue).HasPrecision(18, 2);
            });

            // OrderItem Configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("OrderItem");
                entity.HasKey(e => e.Id);
                
                entity.Ignore(e => e.DiscountAmount);
                entity.Ignore(e => e.Total);
                entity.Ignore(e => e.SelectedToppings);

                entity.Property(e => e.DiscountType).HasConversion<string>();
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.Property(e => e.DiscountValue).HasPrecision(18, 2);
                
                entity.Property<List<OrderItemTopping>>("_selectedToppings")
                    .HasColumnName("Toppings")
                    .HasConversion(
                        v => string.Join(";", v.Select(t => t.Name + "|" + t.Code + "|" + t.Price + "|" + t.ProductId)),
                        v => v.Split(';', StringSplitOptions.RemoveEmptyEntries)
                              .Select(part => part.Split('|', StringSplitOptions.None))
                              .Select(sub => new OrderItemTopping(
                                  Guid.Parse(sub[3]),
                                  sub[0],
                                  decimal.Parse(sub[2]),
                                  sub[1]
                              )).ToList()
                    );
            });

            // SubscriptionHistory Configuration
            modelBuilder.Entity<SubscriptionHistory>(entity =>
            {
                entity.ToTable("SubscriptionHistory");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasPrecision(18, 2);
            });

            // Plan Configuration
            modelBuilder.Entity<Plan>(entity =>
            {
                entity.ToTable("Plan");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasPrecision(18, 2);

                entity.HasData(
                    new Plan
                    {
                        Id = "1",
                        Code = "TRIAL_15_DAYS",
                        Name = "Trial (15 Days)",
                        DurationDays = 15,
                        Price = 0,
                        Description = "Free trial for new users",
                        IsActive = true
                    },
                    new Plan
                    {
                        Id = "2",
                        Code = "BASIC_30_DAYS",
                        Name = "Basic (30 Days)",
                        DurationDays = 30,
                        Price = 500000,
                        Description = "Basic monthly subscription",
                        IsActive = true
                    },
                    new Plan
                    {
                        Id = "3",
                        Code = "PREMIUM_6_MONTHS",
                        Name = "Premium (6 Months)",
                        DurationDays = 180,
                        Price = 2500000,
                        Description = "Premium half-year subscription",
                        IsActive = true
                    },
                    new Plan
                    {
                        Id = "4",
                        Code = "PREMIUM_1_YEAR",
                        Name = "Premium (1 Year)",
                        DurationDays = 365,
                        Price = 4500000,
                        Description = "Premium annual subscription",
                        IsActive = true
                    }
                );
            });

            modelBuilder.Seed();
        }
    }
}
