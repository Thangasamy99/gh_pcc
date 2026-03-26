package com.hospital.config;

import com.hospital.auth.model.Role;
import com.hospital.auth.model.User;
import com.hospital.auth.repository.RoleRepository;
import com.hospital.auth.repository.UserRepository;
import com.hospital.multibranch.model.Branch;
import com.hospital.multibranch.repository.BranchRepository;
import com.hospital.common.service.SequenceGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.hospital.ward.model.Ward;
import com.hospital.ward.model.Room;
import com.hospital.ward.model.Bed;
import com.hospital.ward.repository.WardRepository;
import com.hospital.ward.repository.RoomRepository;
import com.hospital.ward.repository.BedRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @PersistenceContext
    private EntityManager entityManager;

    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SequenceGeneratorService sequenceGenerator;
    private final WardRepository wardRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Starting data initialization...");
        seedRoles();
        seedBranches();
        seedWards();
        seedSuperAdmin();
        seedDemoUsers();
        backfillNullStaffIds();
        System.out.println("Data initialization complete.");
    }

    @SuppressWarnings("null")
    private void seedRoles() {
        System.out.println("Checking roles...");
        List<String> codes = List.of(
            "SUPER_ADMIN", "CENTRAL_PHARMACY_ADMIN", "BRANCH_ADMIN", "DOCTOR", "SURGEON", "SPECIALIST",
            "WARD_NURSE", "MATERNITY_NURSE", "THEATRE_NURSE", "TREATMENT_NURSE", "LAB_TECHNICIAN",
            "RADIOLOGY_TECH", "PHARMACIST", "RECEPTIONIST", "CASHIER", "SECURITY", "ACCOUNTANT",
            "HR_MANAGER", "LOGISTICS", "STORE_KEEPER", "STATISTICIAN"
        );

        for (String code : codes) {
            Role existingRole = roleRepository.findByRoleCode(code).orElse(null);
            if (existingRole == null) {
                Role role = switch (code) {
                    case "SUPER_ADMIN" -> createRole("SUPER_ADMIN", "Super Administrator", "SUP", "System Super Administrator", "Administration", 1, true);
                    case "CENTRAL_PHARMACY_ADMIN" -> createRole("CENTRAL_PHARMACY_ADMIN", "Central Pharmacy Admin", "CPA", "Central Pharmacy Administrator", "Pharmacy", 2, true);
                    case "BRANCH_ADMIN" -> createRole("BRANCH_ADMIN", "Branch Administrator", "ADM", "Branch Administrator", "Administration", 3, true);
                    case "DOCTOR" -> createRole("DOCTOR", "Doctor", "DOC", "Medical Doctor", "Consultation", 4, false);
                    case "SURGEON" -> createRole("SURGEON", "Surgeon", "SUR", "Surgeon", "Operation Theatre", 4, false);
                    case "SPECIALIST" -> createRole("SPECIALIST", "Specialist", "SPC", "Medical Specialist", "Consultation", 4, false);
                    case "WARD_NURSE" -> createRole("WARD_NURSE", "Ward Nurse", "WNR", "Ward Nurse", "Ward Management", 5, false);
                    case "MATERNITY_NURSE" -> createRole("MATERNITY_NURSE", "Maternity Nurse", "MNR", "Maternity Nurse", "Maternity", 5, false);
                    case "THEATRE_NURSE" -> createRole("THEATRE_NURSE", "Theatre Nurse", "TNR", "Operation Theatre Nurse", "Operation Theatre", 5, false);
                    case "TREATMENT_NURSE" -> createRole("TREATMENT_NURSE", "Treatment Nurse", "TRN", "Treatment Room Nurse", "Treatment Room", 5, false);
                    case "LAB_TECHNICIAN" -> createRole("LAB_TECHNICIAN", "Lab Technician", "LAB", "Laboratory Technician", "Laboratory", 5, false);
                    case "RADIOLOGY_TECH" -> createRole("RADIOLOGY_TECH", "Radiology Tech", "RAD", "Radiology Technician", "Imaging", 5, false);
                    case "PHARMACIST" -> createRole("PHARMACIST", "Pharmacist", "PHA", "Pharmacist", "Pharmacy", 5, false);
                    case "RECEPTIONIST" -> createRole("RECEPTIONIST", "Receptionist", "REC", "Front Desk Receptionist", "Reception", 6, false);
                    case "CASHIER" -> createRole("CASHIER", "Cashier", "CSH", "Cash Office Staff", "Billing", 6, false);
                    case "SECURITY" -> createRole("SECURITY", "Security Guard", "SEC", "Security Post Guard", "Security", 6, false);
                    case "ACCOUNTANT" -> createRole("ACCOUNTANT", "Accountant", "ACC", "Accountant", "Accountancy", 5, false);
                    case "HR_MANAGER" -> createRole("HR_MANAGER", "HR Manager", "HRM", "Human Resources Manager", "Human Resources", 4, false);
                    case "LOGISTICS" -> createRole("LOGISTICS" , "Logistics Officer", "LOG", "Logistics Officer", "Logistics", 6, false);
                    case "STORE_KEEPER" -> createRole("STORE_KEEPER", "Store Keeper", "STK", "Store Keeper", "Store", 6, false);
                    case "STATISTICIAN" -> createRole("STATISTICIAN", "Statistician", "STA", "Statistics Officer", "Statistics", 5, false);
                    default -> null;
                };

                if (role != null) {
                    if (roleRepository.existsByRoleName(role.getRoleName())) {
                        System.out.println("Role code " + code + " missing, but role name '" + role.getRoleName() + "' exists. Skipping to avoid conflict.");
                    } else {
                        System.out.println("Adding missing role: " + code);
                        roleRepository.save(role);
                    }
                }
            }
        }
        updateRoleAbbreviations();
    }

    private Role createRole(String code, String name, String abbr, String desc, String dept, int level, boolean system) {
        return Role.builder()
                .roleCode(code)
                .roleName(name)
                .roleAbbreviation(abbr)
                .description(desc)
                .department(dept)
                .roleLevel(level)
                .isSystemRole(system)
                .build();
    }

    private void updateRoleAbbreviations() {
        roleRepository.findByRoleCode("SUPER_ADMIN").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("SUP"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("CENTRAL_PHARMACY_ADMIN").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("CPA"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("BRANCH_ADMIN").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("ADM"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("DOCTOR").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("DOC"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("SURGEON").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("SUR"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("SPECIALIST").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("SPC"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("WARD_NURSE").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("WNR"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("MATERNITY_NURSE").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("MNR"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("THEATRE_NURSE").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("TNR"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("TREATMENT_NURSE").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("TRN"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("LAB_TECHNICIAN").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("LAB"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("RADIOLOGY_TECH").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("RAD"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("PHARMACIST").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("PHA"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("RECEPTIONIST").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("REC"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("CASHIER").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("CSH"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("SECURITY").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("SEC"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("ACCOUNTANT").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("ACC"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("HR_MANAGER").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("HRM"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("LOGISTICS").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("LOG"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("STORE_KEEPER").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("STK"); roleRepository.save(r); } });
        roleRepository.findByRoleCode("STATISTICIAN").ifPresent(r -> { if (r.getRoleAbbreviation() == null) { r.setRoleAbbreviation("STA"); roleRepository.save(r); } });
    }

    @SuppressWarnings("null")
    private void seedBranches() {
        if (branchRepository.count() > 0) {
            System.out.println("Branches already seeded. Current count: " + branchRepository.count());
            return;
        }

        System.out.println("Seeding branches...");
        branchRepository.save(createBranch("CPH", "PCC Central Pharmacy", Branch.BranchType.CENTRAL_PHARMACY, "Buea Road", "Buea", "South West", "+237 672500625", "central.pharmacy@pcc.cm"));
        branchRepository.save(createBranch("BGH", "Buea General Hospital", Branch.BranchType.HOSPITAL, "Molyko", "Buea", "South West", "+237 677123456", "buea.hospital@pcc.cm"));
        branchRepository.save(createBranch("LRH", "Limbe Regional Hospital", Branch.BranchType.HOSPITAL, "Down Beach", "Limbe", "South West", "+237 677123457", "limbe.hospital@pcc.cm"));
        branchRepository.save(createBranch("KDH", "Kumba District Hospital", Branch.BranchType.HOSPITAL, "Kumba Town", "Kumba", "South West", "+237 677123458", "kumba.hospital@pcc.cm"));
        branchRepository.save(createBranch("DGH", "Douala General Hospital", Branch.BranchType.HOSPITAL, "Bonanjo", "Douala", "Littoral", "+237 677123460", "douala.hospital@pcc.cm"));
        branchRepository.save(createBranch("YCH", "Yaoundé Central Hospital", Branch.BranchType.HOSPITAL, "Mfoundi", "Yaoundé", "Centre", "+237 677123463", "yaounde.hospital@pcc.cm"));
    }

    private Branch createBranch(String code, String name, Branch.BranchType type, String address, String city, String region, String phone, String email) {
        return Branch.builder()
                .branchCode(code)
                .branchName(name)
                .branchType(type)
                .address(address)
                .city(city)
                .region(region)
                .phone(phone)
                .email(email)
                .establishedDate(LocalDate.now())
                .isActive(true)
                .isDeleted(false)
                .build();
    }

    @SuppressWarnings("null")
    private void seedSuperAdmin() {
        if (userRepository.existsByUsername("super.admin")) {
            return;
        }

        log.info("Seeding Super Admin...");
        Role superAdminRole = roleRepository.findByRoleCode("SUPER_ADMIN")
                .orElseThrow(() -> new RuntimeException("SUPER_ADMIN role not found"));
        Branch centralBranch = branchRepository.findAll().stream()
                .filter(b -> b.getBranchCode().equals("CPH"))
                .findFirst()
                .orElse(null);

        User superAdmin = User.builder()
                .username("super.admin")
                .email("super.admin@pcc.cm")
                .password(passwordEncoder.encode("Admin@123"))
                .firstName("System")
                .lastName("Administrator")
                .staffId("SUP-001")
                .role(superAdminRole)
                .primaryBranch(centralBranch)
                .isActive(true)
                .isLocked(false)
                .isPasswordExpired(false)
                .build();
        userRepository.save(superAdmin);
    }

    private void seedDemoUsers() {
        System.out.println("Seeding demo users...");
        
        // Buea (HOS-001) Users from CREDENTIALS.txt
        createDemoUser("admin.buea", "admin.buea@pcc.cm", "Branch@123", "Buea", "Admin", "HOS-001", "BRANCH_ADMIN");
        createDemoUser("dr.mbella", "dr.mbella@buea.pcc.cm", "Staff@123", "Sarah", "Mbella", "HOS-001", "DOCTOR");
        createDemoUser("dr.ndifor", "dr.ndifor@buea.pcc.cm", "Staff@123", "John", "Ndifor", "HOS-001", "DOCTOR");
        createDemoUser("dr.ngwa", "dr.ngwa@buea.pcc.cm", "Staff@123", "Elizabeth", "Ngwa", "HOS-001", "DOCTOR");
        createDemoUser("nurse.akono", "nurse.akono@buea.pcc.cm", "Staff@123", "Marie", "Akono", "HOS-001", "WARD_NURSE");
        createDemoUser("nurse.efua", "nurse.efua@buea.pcc.cm", "Staff@123", "Paul", "Efua", "HOS-001", "WARD_NURSE");
        createDemoUser("lab.taku", "lab.taku@buea.pcc.cm", "Staff@123", "James", "Taku", "HOS-001", "LAB_TECHNICIAN");
        createDemoUser("pharm.ngale", "pharm.ngale@buea.pcc.cm", "Staff@123", "Beatrice", "Ngale", "HOS-001", "PHARMACIST");
        createDemoUser("cash.enyi", "cash.enyi@buea.pcc.cm", "Staff@123", "Peter", "Enyi", "HOS-001", "CASHIER");
        createDemoUser("reception.mbua", "reception.mbua@buea.pcc.cm", "Staff@123", "Christine", "Mbua", "HOS-001", "RECEPTIONIST");
        createDemoUser("sec.motuba", "sec.motuba@buea.pcc.cm", "Staff@123", "David", "Motuba", "HOS-001", "SECURITY");

        // Other branches
        createDemoUser("admin.limbe", "admin.limbe@pcc.cm", "Branch@123", "Limbe", "Admin", "HOS-002", "BRANCH_ADMIN");
        createDemoUser("admin.kumba", "admin.kumba@pcc.cm", "Branch@123", "Kumba", "Admin", "HOS-003", "BRANCH_ADMIN");
        createDemoUser("admin.yaounde", "admin.yaounde@pcc.cm", "Branch@123", "Yaounde", "Admin", "HOS-008", "BRANCH_ADMIN");
    }



    private void seedWards() {
        if (wardRepository.count() > 0) {
            return;
        }

        log.info("Seeding Wards, Rooms and Beds...");
        List<Branch> branches = branchRepository.findAll();

        for (Branch branch : branches) {
            if (branch.getBranchType() != Branch.BranchType.HOSPITAL) continue;

            // 1. Male Ward
            Ward maleWard = new Ward();
            maleWard.setWardCode(branch.getBranchCode() + "-MALE");
            maleWard.setWardName("Male General Ward");
            maleWard.setWardType(Ward.WardType.MALE);
            maleWard.setTotalBeds(10);
            maleWard.setOccupiedBeds(0);
            maleWard.setAvailableBeds(10);
            maleWard.setFloor("Floor 1");
            maleWard.setBranch(branch);
            maleWard = wardRepository.save(maleWard);

            seedRoomsForWard(maleWard, 2, 5); // 2 rooms, 5 beds each

            // 2. Female Ward
            Ward femaleWard = new Ward();
            femaleWard.setWardCode(branch.getBranchCode() + "-FEMALE");
            femaleWard.setWardName("Female General Ward");
            femaleWard.setWardType(Ward.WardType.FEMALE);
            femaleWard.setTotalBeds(10);
            femaleWard.setOccupiedBeds(0);
            femaleWard.setAvailableBeds(10);
            femaleWard.setFloor("Floor 1");
            femaleWard.setBranch(branch);
            femaleWard = wardRepository.save(femaleWard);

            seedRoomsForWard(femaleWard, 2, 5);

            // 3. Maternity Ward
            Ward matWard = new Ward();
            matWard.setWardCode(branch.getBranchCode() + "-MAT");
            matWard.setWardName("Maternity Ward");
            matWard.setWardType(Ward.WardType.MATERNITY);
            matWard.setTotalBeds(5);
            matWard.setOccupiedBeds(0);
            matWard.setAvailableBeds(5);
            matWard.setFloor("Floor 2");
            matWard.setBranch(branch);
            matWard = wardRepository.save(matWard);

            seedRoomsForWard(matWard, 1, 5);
        }
    }

    private void seedRoomsForWard(Ward ward, int numRooms, int bedsPerRoom) {
        for (int i = 1; i <= numRooms; i++) {
            Room room = new Room();
            room.setRoomNumber(ward.getWardCode() + "-R" + i);
            room.setWard(ward);
            room.setRoomType(Room.RoomType.GENERAL);
            room.setTotalBeds(bedsPerRoom);
            room.setAvailableBeds(bedsPerRoom);
            room = roomRepository.save(room);

            for (int j = 1; j <= bedsPerRoom; j++) {
                Bed bed = new Bed();
                bed.setBedNumber(room.getRoomNumber() + "-B" + j);
                bed.setRoom(room);
                bed.setWard(ward);
                bed.setStatus(Bed.BedStatus.AVAILABLE);
                bedRepository.save(bed);
            }
        }
    }

    private void createDemoUser(String username, String email, String password, String fName, String lName, String branchCode, String roleCode) {
        User user = userRepository.findByUsername(username).orElse(null);

        Role role = roleRepository.findByRoleCode(roleCode).orElse(null);
        List<Branch> branches = branchRepository.findAll();
        Branch branch = branches.stream()
                .filter(b -> b.getBranchCode() != null && b.getBranchCode().trim().equalsIgnoreCase(branchCode.trim()))
                .findFirst()
                .orElse(null);

        // Fallback for branch mapping
        if (branch == null) {
            String fallbackCode = switch (branchCode) {
                case "HOS-001" -> "BGH";
                case "HOS-002" -> "LRH";
                case "HOS-003" -> "KDH";
                case "HOS-008" -> "YCH";
                case "BGH" -> "HOS-001";
                case "LRH" -> "HOS-002";
                case "KDH" -> "HOS-003";
                case "YCH" -> "HOS-008";
                default -> null;
            };
            if (fallbackCode != null) {
                branch = branches.stream()
                        .filter(b -> b.getBranchCode() != null && b.getBranchCode().trim().equalsIgnoreCase(fallbackCode.trim()))
                        .findFirst()
                        .orElse(null);
            }
        }

        // If still null, just take any hospital branch as a last resort for demo purpose
        if (branch == null && !branches.isEmpty()) {
            branch = branches.stream()
                    .filter(b -> b.getBranchType() == Branch.BranchType.HOSPITAL)
                    .findFirst()
                    .orElse(branches.get(0));
            System.out.println("Warning: Branch " + branchCode + " not found. Falling back to " + branch.getBranchCode() + " for user " + username);
        }

        if (role == null || branch == null) {
            System.out.println("Skipping seeding for user " + username + " - role " + roleCode + " or branch " + branchCode + " not found. Available branches: " + branches.stream().map(Branch::getBranchCode).toList());
            return;
        }

        if (user == null) {
            String staffId = sequenceGenerator.generateStaffId(branch.getBranchCode(), role.getRoleAbbreviation());
            user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(fName)
                    .lastName(lName)
                    .staffId(staffId)
                    .role(role)
                    .primaryBranch(branch)
                    .isActive(true)
                    .isLocked(false)
                    .isPasswordExpired(false)
                    .failedAttempts(0)
                    .build();
            userRepository.save(user);
            System.out.println("Seeded demo user " + username + " with staff ID " + staffId + " and role " + roleCode);
        } else {
            // Update existing user to ensure credentials match the configuration
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.setRole(role);
            user.setPrimaryBranch(branch);
            user.setFirstName(fName);
            user.setLastName(lName);
            user.setIsLocked(false);
            user.setFailedAttempts(0);
            userRepository.save(user);
            System.out.println("Updated and unlocked demo user " + username + " with role " + roleCode);
        }
    }

    private void backfillNullStaffIds() {
        List<User> usersWithNullId = userRepository.findByStaffIdIsNull();
        if (usersWithNullId.isEmpty()) {
            return;
        }

        log.info("Backfilling staff IDs for {} users...", usersWithNullId.size());
        for (User user : usersWithNullId) {
            if (user.getRole() == null || user.getRole().getRoleAbbreviation() == null) {
                log.warn("Cannot backfill staff ID for user {} - missing role or abbreviation", user.getUsername());
                continue;
            }

            String branchCode = "GEN";
            if (user.getPrimaryBranch() != null) {
                branchCode = user.getPrimaryBranch().getBranchCode();
            }

            String staffId = sequenceGenerator.generateStaffId(branchCode, user.getRole().getRoleAbbreviation());
            user.setStaffId(staffId);
            userRepository.save(user);
            entityManager.flush(); // Ensure sequence generator sees this record
            log.info("Assigned staff ID {} to user {}", staffId, user.getUsername());
        }
    }
}
