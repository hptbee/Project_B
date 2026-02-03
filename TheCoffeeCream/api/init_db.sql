-- Auto-generated SQL script from Excel for PostgreSQL

-- Table: Product
DROP TABLE IF EXISTS "Product" CASCADE;
CREATE TABLE "Product" (
    "Id" TEXT,
    "CategoryId" TEXT,
    "Code" TEXT,
    "Name" TEXT,
    "Cost" INTEGER,
    "Price" INTEGER,
    "ImageUrl" TEXT,
    "IsActive" BOOLEAN,
    "IsTopping" BOOLEAN,
    "ToppingMapping" TEXT,
    PRIMARY KEY ("Id")
);

INSERT INTO "Product" ("Id", "CategoryId", "Code", "Name", "Cost", "Price", "ImageUrl", "IsActive", "IsTopping", "ToppingMapping")
VALUES
('ab312563-3889-48a5-a6c6-425fbbf3da53', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00001', 'Cafe đen', 0, 17000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/19ab4aab241840218bd0c37d476e8bc6', TRUE, FALSE, 'b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213'),
('90ad4f33-185a-4102-b9e0-4c530b4a8e49', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00002', 'Cafe Sữa', 0, 20000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/fe1eac213aea4d0baa8a5b3fbb77ebf0', TRUE, FALSE, 'b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213'),
('7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00003', 'Bạc Xỉu', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/ce1c0465fe06481bbc400829aad976f6', TRUE, FALSE, 'bdf0dd62-999e-43a1-ad09-d3c0d4abb209;7c4fc531-5fcd-4892-b505-99815dac20cb'),
('14c0d157-1153-4755-9482-f6896439347c', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00004', 'Sữa tươi Cafe', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/875d769b87e9444dbda8739141004e14', TRUE, FALSE, '71bcd18c-4a4b-4bf8-98d6-f4b8b4817213;b9bd6435-a4f6-4eac-ad5f-adeffaace50a'),
('96c25787-d618-4e62-a462-ced4a309bcfa', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00005', 'Sữa tươi Cafe bạc hà', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/6c1975985b3a400aa9fb3aa55cb4987f', TRUE, FALSE, '71bcd18c-4a4b-4bf8-98d6-f4b8b4817213;b9bd6435-a4f6-4eac-ad5f-adeffaace50a'),
('87b9f742-5e2a-4ced-8102-ad0787555a23', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00006', 'Cafe Sữa Dừa', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/1355e61f546c43b88e762d1da6d3d406', TRUE, FALSE, 'b9bd6435-a4f6-4eac-ad5f-adeffaace50a;71bcd18c-4a4b-4bf8-98d6-f4b8b4817213'),
('b254080b-879d-4239-8461-cabf3ddc63b1', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00008', 'Cafe Kem Trứng', 0, 31000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/c65e76bc509f4b34a55cbbf951ac8465', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('6746ceed-0719-43c2-ad21-0eff24b4397d', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00009', 'Cafe Kem Cafe', 0, 31000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/129c9eea1df84867ada63f5eb7a63ea2', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('114895a2-9db4-418b-a6a5-fb9533ed31df', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00010', 'Cafe Kem Muối', 0, 31000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/a49d48e0e6c942cbae719df06d813b30', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('28218217-be9b-4554-89e0-cee61a074ea9', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00011', 'Bạc Xỉu Kem Cafe', 0, 33000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('0f221ecf-21f6-432c-9503-e0887e55fa9f', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00012', 'Bạc Xỉu Kem Muối', 0, 33000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/a0b0997b4aaa4026b3de092157d07ada', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('146a5cc5-aa57-43fc-af71-ffe66ac47385', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00013', 'Bạc Xỉu Kem Trứng', 0, 33000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/72987776a81b4a9f8729fb34963ba3bc', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('91c24d16-e899-4890-b746-8175c4f7ca81', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00014', 'Trà Tắc mật ong', 0, 21000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/2dc975c2c4844d3bab18d33dfcfe88ab', TRUE, FALSE, NULL),
('833c5666-83f1-4612-b64d-36fc42605a50', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP-00015', 'Trà Sữa bạc hà', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/6344aa1d2e0a4ba28db518b161999233', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('10a54543-8afb-4df1-b5be-0f0758d8c5b2', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP-00016', 'Trà Sữa mật ong', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/6b83f3e2d4124d6db7a48318a781b18f', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('ccd1e85e-75d5-44d4-b716-e141ea11d9d2', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00018', 'Trà Bí Đao Hạt Chia', 0, 16000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/337ada042073495dace75e8118499b3f', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('12e75a1d-1983-4333-b58b-8eebb68da485', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00019', 'Trà Cam Dâu Tây', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/b59d3298b28e4b11a450fb0446b2cb59', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('be2f1018-c45c-4a8f-9fca-3faef620de52', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00021', 'Trà Dâu Đào Nhài', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/3d32a355018f40be90e5fbaf741af686', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('8c0840dd-c8cd-4a38-bc28-fd594db4773a', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00022', 'Trà Cam Đào Nhài', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/c9cb45cb233346538f3e0c99f115d13d', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('208ad30c-ffd2-49e4-95f8-99de88bbf2c0', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00023', 'Trà Long Nhãn', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/97a461f0ec254bdaa5b04b0459b197ef', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('6d447ba0-ef3d-4b24-b761-c4fb2e2fa48d', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00024', 'Trà Việt Quất', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/bcacad82215e40c492a8ab3594354851', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('f5de696e-6723-4573-934f-739001501fec', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP-00026', 'Trà Sữa Kem Muối', 0, 31000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/d7f1cf37b2bd44dab943a46579f858c3', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('b6a5c2ba-a68f-4d0a-97cf-e9ae53a818bc', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00027', 'Trà Vải', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/51c1c3530f5a48bfb7a94ba66f2fb9d0', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('f9f47107-cc85-4f79-a034-f8af086de65c', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00028', 'Trà đào cam sả', 0, 35000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/892f5479d0e64fc2a43b5c9af40e6dfc', TRUE, FALSE, NULL),
('9e21e714-0035-4447-83d5-0ef1a762801c', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP-00029', 'Trà Sữa Kem Trứng', 0, 31000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/55b97d8141a143f48504ddbde6f830d8', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('eb047eea-b3cf-4324-9a97-6fec1fabb126', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP-00030', 'Trà Sữa Trân Châu', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/757ebd134e654615959a0b9cd516a97c', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('427f6159-bfe5-45be-a214-ef7809e4500d', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP-00031', 'Cacao Nóng', 0, 29000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/e5717957817a4f1b8c78f02925a52217', TRUE, FALSE, NULL),
('00440a8a-46fb-4fe7-a84d-b394c0366172', '5d49224a-7fd8-436f-a9a7-b04cf681f706', 'SP-00032', 'Cacao Kem Cafe', 0, 36000, NULL, TRUE, FALSE, NULL),
('2f929c03-306a-4c1a-b6ee-a56f55d51a6b', '5d49224a-7fd8-436f-a9a7-b04cf681f706', 'SP-00033', 'Cacao Kem Muối', 0, 36000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/a341dd57e8ab480ab88f0fadeec6807b', TRUE, FALSE, NULL),
('6ee6f009-54f8-4f50-8510-24fc5a4f8303', '5d49224a-7fd8-436f-a9a7-b04cf681f706', 'SP-00034', 'Cacao Kem Trứng', 0, 36000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/8677b562142c4458ab20797b15f5df01', TRUE, FALSE, NULL),
('911cc8b5-144c-42b8-b51a-ad42a21d096a', '5d49224a-7fd8-436f-a9a7-b04cf681f706', 'SP-00035', 'Cacao topping', 0, 36000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/daec0ce07ce64ae6ac0e6d7cc3a8b906', TRUE, FALSE, NULL),
('30c8b484-b8c2-4184-a2fa-e7395f9fdf7b', '485e5bd2-e0f6-4a56-9f20-cd1707db60f1', 'SP-00037', 'Cam Vắt', 0, 21000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/fce52367fa334836a28b190b5ba79ddf', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('e6bd85b9-496e-4822-9579-507e473bcbd4', '485e5bd2-e0f6-4a56-9f20-cd1707db60f1', 'SP-00042', 'Cam xí muội', 0, 35000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/7ff345f76db342b89c77069079442d68', TRUE, FALSE, NULL),
('4778f715-539c-4f26-834e-ff4c2d2d317c', '485e5bd2-e0f6-4a56-9f20-cd1707db60f1', 'SP-00043', 'Bánh que Kem Cafe', 0, 26000, NULL, TRUE, FALSE, NULL),
('1a31f823-fa6b-41bf-bf1e-c72673cf5624', '485e5bd2-e0f6-4a56-9f20-cd1707db60f1', 'SP-00044', 'Bánh que Kem Trứng', 0, 25000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/4580383fc3314938808909b090b7cd86', TRUE, FALSE, NULL),
('f1cbce95-25d3-4024-a0d3-a7e9c1c22752', '485e5bd2-e0f6-4a56-9f20-cd1707db60f1', 'SP-00045', 'Bánh que Kem Muối', 0, 26000, NULL, TRUE, FALSE, NULL),
('65b38984-b052-455c-81e9-737f45f88f24', 'a687085b-5ddc-49b5-8724-e94bd31ba54f', 'SP-00046', 'C2 - Boncha - Olong', 0, 14000, NULL, TRUE, FALSE, NULL),
('c81c2167-fd27-466d-a956-566418001890', 'a687085b-5ddc-49b5-8724-e94bd31ba54f', 'SP-00047', 'Bò húc', 0, 15000, NULL, TRUE, FALSE, NULL),
('295cb803-d8b6-4579-bb50-0596b2e11ad4', 'a687085b-5ddc-49b5-8724-e94bd31ba54f', 'SP-00048', 'Sting', 0, 14000, NULL, TRUE, FALSE, NULL),
('387a4034-7f4e-4a8d-9efc-a2753025a0db', 'a687085b-5ddc-49b5-8724-e94bd31ba54f', 'SP-00049', 'Nước suối', 0, 8000, NULL, TRUE, FALSE, NULL),
('455b33bb-9306-4f5e-b28d-35d311e58339', 'a687085b-5ddc-49b5-8724-e94bd31ba54f', 'SP-00050', 'Coca/Pepsi', 0, 14000, NULL, TRUE, FALSE, NULL),
('d21d7c76-1f6d-417b-bdb5-305d0f651214', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00051', 'Chai Cafe Kem Trứng - 500ml', 0, 150000, NULL, TRUE, FALSE, NULL),
('6667ab35-f248-4309-8c72-55438246246b', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00052', 'Hủ Kem Trứng', 0, 80000, NULL, TRUE, FALSE, NULL),
('b3a1f3a7-8eb0-4d0a-ae24-89aa164ce5b6', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00053', 'Chai Cafe Kem Muối 500ml', 0, 150000, NULL, TRUE, FALSE, NULL),
('d3069ed2-2fd4-4834-8855-5e88b0db9c58', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00054', 'Chai Cafe Kem Cafe 500ml', 0, 150000, NULL, TRUE, FALSE, NULL),
('b67f41a3-8896-42c8-87c7-b5732fb1388f', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00055', 'Chai Cafe Kem Muối 250ml', 0, 80000, NULL, TRUE, FALSE, NULL),
('16e3dacf-e433-49ae-b018-ffcffabe4cf1', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00056', 'Hủ Kem Muối', 0, 80000, NULL, TRUE, FALSE, NULL),
('2d73c896-8bf7-4bcc-b034-20310b5dfea3', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00057', 'Hủ Kem Cafe', 0, 80000, NULL, TRUE, FALSE, NULL),
('cb856642-aea9-4725-b56d-80579409f353', 'added61a-03d3-465e-8ebf-9f90b729c2b5', 'SP-00058', 'Chai Cafe Kem Trứng 250ML', 0, 80000, NULL, TRUE, FALSE, NULL),
('f0375bb2-4de4-4c3e-aecb-a2f9f657524e', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP-00059', 'Gói cafe 500 gram', 0, 115000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/53f5642fb646499a9c5fd5e27dfab2b6', TRUE, FALSE, NULL),
('7da34025-08ac-4874-8e1b-8e6531a13069', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00063', 'Tẩy đá', 0, 2000, NULL, TRUE, FALSE, NULL),
('b15b2e56-01bf-480a-b40f-f80cb84ccff7', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00064', 'Bánh que thêm', 0, 10000, NULL, TRUE, FALSE, NULL),
('2c9db8fd-3005-4bc0-b976-e50e6b2d1795', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00017', 'Trà Tắc', 0, 16000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/05deadc4d0ab428681745606b557afec', TRUE, TRUE, NULL),
('211bf531-1fa8-4902-924d-30d29bb07dfc', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00060', 'Đào', 0, 6000, NULL, TRUE, TRUE, NULL),
('b02a9a82-88a9-496c-b2e9-acce68133be8', '05ab0a7a-8a5c-43d1-93dc-bef44fa28908', 'SP000005', 'Sữa Tươi Trân Châu Đường Đen', 0, 31000, NULL, TRUE, FALSE, NULL),
('7ec520df-3415-4219-9805-de907b24f626', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000006', 'Cafe sữa gấu', 0, 33000, NULL, TRUE, FALSE, NULL),
('4daf624d-ee1e-4c1a-9b56-f74ba3c98e00', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP000007', 'Bạc xỉu nóng', 0, 29000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/09/cafehuynhvanbanh/images/5aee77c786294f9182352e7533574ea7', TRUE, FALSE, NULL),
('8a45f672-854e-4660-955d-96dabd6a30c8', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000008', 'Lon Sữa Gấu bán lẻ', 0, 16000, NULL, TRUE, FALSE, NULL),
('128ee0a0-58cd-4a8c-9c16-669bb13bd317', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP000009', 'Trà Đào', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/09/cafehuynhvanbanh/images/6082d7c94b344534b80f0fd0ade5931a', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('d57b2b4a-d47f-4814-8aaf-a2e900b30dce', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000012', 'Hạt chia', 0, 2000, NULL, TRUE, FALSE, NULL),
('bb88ac8d-7fe9-4b87-81fd-6872cb5fcbdf', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000013', 'Cacao sữa gấu', 35, 33000, NULL, TRUE, FALSE, NULL),
('282208c6-3989-4ef8-a2cf-d91a9a1e80b2', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00061', 'Nhãn', 0, 6000, NULL, TRUE, TRUE, NULL),
('7fc72b45-adf1-44d6-b2bf-d93af275dd01', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00062', 'Vải', 0, 6000, NULL, TRUE, TRUE, NULL),
('ec676505-d248-4a18-9cd9-a6958914b713', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00065', 'UpSize L', 0, 5000, NULL, TRUE, TRUE, NULL),
('7be13434-8eca-4794-ba08-f30a1267de37', '05ab0a7a-8a5c-43d1-93dc-bef44fa28908', 'SP000014', 'Matcha Latte', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2025/05/cafehuynhvanbanh/images/d82cd8a409c24907975c885baded0acd', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('f93222da-7a28-48d2-b9b4-39bd8095edea', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000015', 'Matcha Sữa Gấu', 0, 33000, NULL, TRUE, FALSE, NULL),
('706a36cb-dbf3-420e-9dc0-a214d1c3691e', '05ab0a7a-8a5c-43d1-93dc-bef44fa28908', 'SP000016', 'Cacao Latte', 0, 33000, NULL, TRUE, FALSE, NULL),
('9bde306e-a812-4335-a35d-9e37d09eed16', '05ab0a7a-8a5c-43d1-93dc-bef44fa28908', 'SP000017', 'Khoai Môn Latte', 0, 27000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('1f2a0019-95d9-4cbc-80db-5c40d165bce6', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP000019', 'Trà sữa khoai môn', 26, 26000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('4faa1638-1017-487a-b32c-2b26750d4991', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP000020', 'Trà sữa matcha', 26, 26000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('e8bec0cb-bf7b-4a99-9869-159eaa1a4188', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000021', 'Khoai Môn Sữa Gấu', 0, 33000, NULL, TRUE, FALSE, NULL),
('9884c88a-fc64-450e-ba7b-2268d7647286', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP000022', 'Cacao latte Nóng', 0, 29000, NULL, TRUE, FALSE, NULL),
('7985c414-63ac-436c-91b6-cd312cfac0a6', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP000023', 'Matcha Latte Nóng', 0, 29000, NULL, TRUE, FALSE, NULL),
('cbf166c3-e277-45c9-b6ea-735914b94fea', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP000024', 'Trà Sữa Truyền Thống', 20, 21000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('4686c33c-dc50-4b14-8c07-7def6e5f5b3a', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000025', 'Matcha Sữa Hạt', 0, 33000, NULL, TRUE, FALSE, NULL),
('e26ec092-0bd2-4234-b53e-2c3814947f4d', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000026', 'Cacao sữa hạt', 0, 33000, NULL, TRUE, FALSE, NULL),
('dce87e70-908c-450e-bb38-650e3bf42f5a', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000027', 'Cà Phê Sữa Hạt', 0, 33000, NULL, TRUE, FALSE, NULL),
('e399ac78-d443-4b4c-b864-2b84b7bae3a9', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00066', 'Kem Muối', 0, 16000, NULL, TRUE, TRUE, NULL),
('6133f30a-d55f-4960-a0a0-472861fa4b82', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000028', 'Khoai Môn Sữa Hạt', 32, 33000, NULL, TRUE, FALSE, NULL),
('6ba76c7d-41a4-4fc3-9314-6dcae92de859', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000031', 'Trà đá', 5, 5000, NULL, TRUE, FALSE, NULL),
('dbfa31a8-b73e-4d54-8cc0-b52486218d45', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP000032', 'Cà phê sữa cốt dừa nóng', 0, 25000, NULL, TRUE, FALSE, NULL),
('d2e2aef1-25fb-4a80-8475-ca1e9eb37499', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00067', 'Kem Cafe', 0, 16000, NULL, TRUE, TRUE, NULL),
('19118b14-781c-482f-820c-838585e41cce', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00068', 'Kem Trứng', 0, 16000, NULL, TRUE, TRUE, NULL),
('9060af17-9a7c-494c-8f53-99ecc77bf60f', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00069', 'Trân châu đường đen', 0, 6000, NULL, TRUE, TRUE, NULL),
('d3be58c8-2245-4343-9858-0ea661f45c5d', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00070', 'Thạch Cafe', 0, 6000, NULL, TRUE, TRUE, NULL),
('b02b3f35-afa1-4e11-b5d8-cd0efbeec1c3', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00071', 'Trân châu trắng', 0, 6000, NULL, TRUE, TRUE, NULL),
('c44f061f-091b-4a8b-8938-d9953394f77f', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000033', 'Cà phê bột', 0, 10000, NULL, TRUE, FALSE, NULL),
('8b78b57c-c14d-453f-951c-d4f9f4c6b947', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP000035', 'Olong Lài Sữa', 0, 28000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('50f636b8-378b-45e5-a8c1-b4938544257e', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP000037', 'Trà Gừng Nóng', 0, 20000, NULL, TRUE, FALSE, NULL),
('d5e81e81-c3c3-4062-bc49-e593a59fcbbd', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000038', 'BT Muối bò - Sa Tế', 12, 10000, NULL, TRUE, FALSE, NULL),
('d1bed7bb-2deb-4086-b380-48afed37d365', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000040', 'BT Muối Tắc - Sa Tế Hồng Hạnh', 8, 10000, NULL, TRUE, FALSE, NULL),
('9241f243-efc9-4f4d-8b93-cda314fc12a7', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000041', 'Bánh Tráng Dẻo Khô Gà', 8, 7000, NULL, TRUE, FALSE, NULL),
('fccbca47-b3df-4ba0-aa03-1a3ba874263f', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP000045', 'Cà Phê Matcha', 0, 27000, NULL, TRUE, FALSE, NULL),
('7e651fc8-3601-45a0-9fa0-550c4cf5724b', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000047', 'Xì ke', 0, 12000, NULL, TRUE, FALSE, NULL),
('9f2c80d0-7f69-4d63-87bb-34e85313e6a9', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP-00072', 'Dâu', 0, 6000, NULL, TRUE, TRUE, NULL),
('d34f81b6-7fe4-43f3-baea-560bc3e185b5', '05ab0a7a-8a5c-43d1-93dc-bef44fa28908', 'SP000048', 'Matcha Latte Đào', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2025/05/cafehuynhvanbanh/images/26cd66b9b4ef41e0a267084915ad60eb', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('233410ca-66b9-47a4-8a55-8f98850282ec', '05ab0a7a-8a5c-43d1-93dc-bef44fa28908', 'SP000049', 'Matcha Latte Dâu', 0, 27000, 'https://cdn1-fnb-userdata.kiotviet.vn/2025/05/cafehuynhvanbanh/images/ec9f31efa56f43d1af435a24b65232aa', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('7b18d1e8-b500-47fd-8d31-3e3f73462367', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000050', 'Trà đá đường dằn 10ml cf', 0, 10000, NULL, TRUE, FALSE, NULL),
('4f18ac42-4bbf-4e41-9302-498f8b78d097', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP000051', 'Khoai môn Latte Nóng', 0, 29000, NULL, TRUE, FALSE, NULL),
('404a6736-9040-440e-a572-6c890c0637b1', 'cf121efe-0380-48eb-82ba-5f26c6f67fab', 'SP000052', 'Sữa tươi cf nóng', 0, 29000, NULL, TRUE, FALSE, NULL),
('f780a926-c1f9-4441-82ff-f098dc2d5a56', '97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'SP000053', 'Olong gạo rang', 0, 28000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('a19e6312-94fc-45a7-8d2f-06c42d7e23ba', '5d49224a-7fd8-436f-a9a7-b04cf681f706', 'SP000054', 'Cacao sữa dừa kem trứng', 35, 36000, NULL, TRUE, FALSE, NULL),
('5fdcb4e2-a2c9-49dd-979e-4d2208ed51ba', '00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'SP-00020', 'Trà Dâu', 0, 26000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/acc839cd12e443618e156ded79f5fdd4', TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('d44db9fd-1b4d-4f36-a35e-c9fca970c349', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP000059', 'Cà Phê Kem Vip', 19, 40000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('a5ffc906-f201-4c8c-815a-26d0bb31f9e7', '23a13583-3794-4fa1-8704-ba54916dff7d', 'SP000060', 'Matcha Gấu Dâu', 36, 36000, NULL, TRUE, FALSE, NULL),
('c1cfd26a-6f15-4b24-ade0-d9a27d15f2a5', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000061', 'áo mưa', 10, 10000, NULL, TRUE, FALSE, NULL),
('3cb55a6b-7101-48ad-abb9-a32308b36939', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000066', 'bánh snack', 8, 8000, NULL, TRUE, FALSE, NULL),
('0e411c9e-fbac-4659-95be-1a28ffcd9d0b', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000068', 'Ly giấy', 0, 3000, NULL, TRUE, FALSE, NULL),
('9218e983-dd30-436c-9eef-4de76e7d40e1', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000069', 'Thuốc lá 3 số bạc', 0, 28000, NULL, TRUE, FALSE, NULL),
('b2665338-4d54-41ba-a9ea-c6f80ece03db', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000070', 'Thuốc lá 3 số thường', 0, 18000, NULL, TRUE, FALSE, NULL),
('17035377-5532-4444-b1b0-f44ce78d3322', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000071', 'Thuốc lá Sài Gòn Bạc', 0, 18000, NULL, TRUE, FALSE, NULL),
('a1e103b8-2a0e-4a8d-a9d2-f1e4aa3e3523', '485e5bd2-e0f6-4a56-9f20-cd1707db60f1', 'SP000072', 'Trà Gạo Rang Machiato', 0, 28000, NULL, TRUE, FALSE, 'ec676505-d248-4a18-9cd9-a6958914b713'),
('5003f111-aebc-49b9-b2f2-ea314fc6f3f1', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000073', 'Tắc mật ong nóng', 0, 23000, NULL, TRUE, FALSE, NULL),
('34c2a734-a92f-46c2-b5d9-25496f80f0b3', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP000075', 'Cà phê nóng', 0, 19000, NULL, TRUE, FALSE, NULL),
('007183c7-8fba-43b9-adfc-238a63dd7df9', '1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'SP000077', 'Cà phê sữa nóng', 0, 27000, NULL, TRUE, FALSE, NULL),
('e420babb-5f14-4ab0-aede-33f0c9b1575d', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000083', 'Hột quẹt', 0, 5000, NULL, TRUE, FALSE, NULL),
('dc5413f1-75cc-48d6-8631-556fa4a074a5', '6648dbe7-e96c-4e74-87c9-854747e94ae5', 'SP000086', 'thuốc malu 20k', 0, 20000, NULL, TRUE, FALSE, NULL),
('9510f1d2-0576-4129-aca5-e4e354b95a02', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000091', 'Đậu phộng', 0, 4000, NULL, TRUE, FALSE, NULL),
('b9bd6435-a4f6-4eac-ad5f-adeffaace50a', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000055', 'Size M', 0, 5000, NULL, TRUE, TRUE, NULL),
('b71d8749-4482-423e-8d50-c64175cefe27', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000092', 'Socola', 0, 4000, NULL, TRUE, FALSE, NULL),
('afe1a263-2aaa-4a8d-99e8-3310b8286f22', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000093', 'Bánh Tráng khô Bò', 0, 7000, NULL, TRUE, FALSE, NULL),
('71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000056', 'Size L', 0, 10000, NULL, TRUE, TRUE, NULL),
('29ca5d65-3974-4719-9d99-7e9b7d7a2e30', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000097', 'Trân Châu Hoàng Kim', 0, 6000, NULL, TRUE, FALSE, NULL),
('bdf0dd62-999e-43a1-ad09-d3c0d4abb209', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000057', 'Size M - Bạc Xỉu', 0, 6000, NULL, TRUE, TRUE, NULL),
('7c4fc531-5fcd-4892-b505-99815dac20cb', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000058', 'Size L - Bạc Xỉu', 0, 12000, NULL, TRUE, TRUE, NULL),
('20b5778c-cb09-4194-8fc8-ea900d1abab9', '2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'SP000067', 'Pha máy', 0, 2000, NULL, TRUE, TRUE, NULL),
('145744cd-189c-4d0d-bf57-c0331c497e31', 'ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'SP000098', 'Bánh Tráng Hành Phi', 10, 7000, NULL, TRUE, FALSE, NULL);

-- Table: Category
DROP TABLE IF EXISTS "Category" CASCADE;
CREATE TABLE "Category" (
    "Id" TEXT,
    "Name" TEXT,
    "Rank" INTEGER,
    "IsActive" BOOLEAN,
    PRIMARY KEY ("Id")
);

INSERT INTO "Category" ("Id", "Name", "Rank", "IsActive")
VALUES
('6648dbe7-e96c-4e74-87c9-854747e94ae5', 'Khác', 14, FALSE),
('ad8147f8-cccf-420f-bc55-d3d2491dfa81', 'Bánh', 7, FALSE),
('2bfba6b7-c0eb-47dd-a06b-14fda34023ae', 'TOPPING', 13, FALSE),
('1d4b6612-5cd7-4c9f-9fda-8209e95da2ae', 'Cafe', 1, FALSE),
('6138ec79-4292-4747-81aa-d0e4d308efda', 'Specialty', 2, FALSE),
('485e5bd2-e0f6-4a56-9f20-cd1707db60f1', 'Món khác', 9, FALSE),
('23a13583-3794-4fa1-8704-ba54916dff7d', 'Trending', 8, FALSE),
('5d49224a-7fd8-436f-a9a7-b04cf681f706', 'Cacao', 4, FALSE),
('97f21f46-4f5e-4979-8d66-c5e666e50aa4', 'Trà Sữa', 3, FALSE),
('cf121efe-0380-48eb-82ba-5f26c6f67fab', 'Món Nóng', 10, FALSE),
('05ab0a7a-8a5c-43d1-93dc-bef44fa28908', 'Latte', 5, FALSE),
('00f6c7bb-e1b1-4d79-b3b1-112e7dcb6700', 'Trà trái cây', 6, FALSE),
('added61a-03d3-465e-8ebf-9f90b729c2b5', 'Chai hủ', 11, FALSE),
('a687085b-5ddc-49b5-8724-e94bd31ba54f', 'Nước ngọt', 12, FALSE);

-- Table: Order
DROP TABLE IF EXISTS "Order" CASCADE;
CREATE TABLE "Order" (
    "Id" TEXT,
    "ClientOrderId" TEXT,
    "CreatedAt" TEXT,
    "OrderType" TEXT,
    "TableNumber" INTEGER,
    "PaymentMethod" TEXT,
    "CashAmount" INTEGER,
    "TransferAmount" INTEGER,
    "DiscountType" TEXT,
    "DiscountValue" INTEGER,
    "DiscountAmount" INTEGER,
    "SubTotal" INTEGER,
    "Total" INTEGER,
    "Status" TEXT,
    "Note" TEXT,
    "IsActive" BOOLEAN,
    PRIMARY KEY ("Id")
);

INSERT INTO "Order" ("Id", "ClientOrderId", "CreatedAt", "OrderType", "TableNumber", "PaymentMethod", "CashAmount", "TransferAmount", "DiscountType", "DiscountValue", "DiscountAmount", "SubTotal", "Total", "Status", "Note", "IsActive")
VALUES
('d369ce93-a94e-4309-8ebd-5a4a48f50223', 'eba284e9-7242-423a-9311-1c44eaaa791e', '2026-01-31T14:42:59.0000000+00:00', 'DINE_IN', 1, 'CASH', 88000, 0, 'FIXED', 0, 88000, 0, 88000, 'SUCCESS', NULL, TRUE),
('5023276e-e38f-45fb-b82f-6aad4abb5c84', '674390a7-d2ce-4772-9ed7-868f702ee0de', '2026-02-01T02:51:36.4756926+00:00', 'DINE_IN', 0, 'CASH', 33000, 0, 'FIXED', 0, 33000, 0, 33000, 'SUCCESS', NULL, TRUE),
('1b64331b-0eb7-462f-bbaf-170c5cc41866', '9330ac5c-2f14-43f6-87e2-853050e92ea4', '2026-02-01T02:52:06.2679971+00:00', 'DINE_IN', 0, 'CASH', 27000, 0, 'FIXED', 0, 27000, 0, 27000, 'SUCCESS', NULL, TRUE),
('e65f17fc-d1c0-4856-91d3-fdbcb8e65fe9', '17326de9-b394-4ccf-8e46-4f5bce5e8db7', '2026-02-01T03:10:12.2940465+00:00', 'DINE_IN', 0, 'CASH', 38000, 0, 'FIXED', 0, 38000, 0, 38000, 'SUCCESS', NULL, TRUE),
('f01f0f26-1163-4d94-8a28-2877d7f08678', '219dd05a-6b27-4495-b7a3-953a7960aff6', '2026-02-01T03:10:31.1470379+00:00', 'DINE_IN', 0, 'CASH', 31000, 0, 'FIXED', 0, 31000, 0, 31000, 'SUCCESS', NULL, TRUE),
('48018d15-0ef5-40bb-ba37-8c6b574ef11d', '68f785c6-e67a-483a-b3b9-76a7967d8d94', '2026-02-01T03:10:59.8470010+00:00', 'DINE_IN', 0, 'CASH', 38000, 0, 'FIXED', 0, 38000, 0, 38000, 'SUCCESS', NULL, TRUE),
('0bc99059-430e-43f4-a8ee-e498634b7354', 'ad229094-bc9c-4a51-bd2d-f3e9aacf9960', '2026-02-01T03:11:09.5836898+00:00', 'DINE_IN', 0, 'CASH', 20000, 0, 'FIXED', 0, 20000, 0, 20000, 'SUCCESS', NULL, TRUE),
('b94061e9-d7f8-41a4-8fce-b4083d48d923', '7a7a41bc-4554-42c3-9405-231998299ab3', '2026-02-01T03:11:19.9475490+00:00', 'DINE_IN', 0, 'TRANSFER', 0, 27000, 'FIXED', 0, 27000, 0, 27000, 'SUCCESS', NULL, TRUE),
('5a1bdc7a-d97e-4dcf-96c5-34d9bbc13f36', 'b7e65632-fecd-401d-baf1-a17c8aba290b', '2026-02-01T03:11:54.3093889+00:00', 'DINE_IN', 0, 'TRANSFER', 0, 66000, 'FIXED', 0, 66000, 0, 66000, 'SUCCESS', NULL, TRUE),
('2dfe3322-f5e8-4dc0-9e50-4ff930eaf036', 'ab0b5752-a808-4ba8-8355-272e0ef28080', '2026-02-01T03:12:55.3859409+00:00', 'DINE_IN', 0, 'TRANSFER', 0, 30000, 'FIXED', 0, 30000, 0, 30000, 'SUCCESS', NULL, TRUE),
('af45f7e3-71cd-4203-8218-f33db17cf37f', '75c1f412-0dd6-4035-b324-0c3eeb9e83dc', '2026-02-01T03:13:07.0091873+00:00', 'DINE_IN', 0, 'CASH', 32000, 0, 'FIXED', 0, 32000, 0, 32000, 'SUCCESS', NULL, TRUE),
('79511ba5-3a1d-4554-adbb-98db3022b5d4', 'da2e20bb-ab4d-4aaf-ba42-f709b3d8c0e5', '2026-02-02T12:34:28.0000000+07:00', 'DINE_IN', 1, 'TRANSFER', 0, 162000, 'FIXED', 0, 162000, 0, 162000, 'SUCCESS', NULL, TRUE),
('88040bdc-861d-4418-aa55-f254a7a2525b', 'd05e146b-b3d6-47c0-9a49-052d684d35b4', '2026-02-02T06:43:45.9416375+00:00', 'DINE_IN', 1, 'CASH', 27000, 0, 'FIXED', 0, 27000, 0, 27000, 'SUCCESS', NULL, TRUE);

-- Table: OrderItem
DROP TABLE IF EXISTS "OrderItem" CASCADE;
CREATE TABLE "OrderItem" (
    "Id" TEXT,
    "OrderId" TEXT,
    "CreatedAt" TEXT,
    "ProductId" TEXT,
    "Name" TEXT,
    "UnitPrice" INTEGER,
    "Quantity" INTEGER,
    "DiscountType" TEXT,
    "DiscountValue" INTEGER,
    "DiscountAmount" INTEGER,
    "Total" INTEGER,
    "Toppings" TEXT,
    "Note" TEXT,
    "IsActive" BOOLEAN,
    PRIMARY KEY ("Id")
);

INSERT INTO "OrderItem" ("Id", "OrderId", "CreatedAt", "ProductId", "Name", "UnitPrice", "Quantity", "DiscountType", "DiscountValue", "DiscountAmount", "Total", "Toppings", "Note", "IsActive")
VALUES
('109a5a0e-0a30-426d-b2ec-f742ef01fd15', '5023276e-e38f-45fb-b82f-6aad4abb5c84', '2026-02-01T02:51:36.4756835+00:00', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 1, NULL, 0, 0, 33000, 'Size M - Bạc Xỉu|SP000057|6000|bdf0dd62-999e-43a1-ad09-d3c0d4abb209', NULL, TRUE),
('2ae9b0d6-ef2d-4069-806f-a5f11e326d9f', '1b64331b-0eb7-462f-bbaf-170c5cc41866', '2026-02-01T02:52:06.2679857+00:00', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 27000, 'Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', NULL, TRUE),
('4565424a-6343-4748-ab78-41174fddb4db', 'd369ce93-a94e-4309-8ebd-5a4a48f50223', '2026-01-31T14:42:59.0000000+00:00', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 4, NULL, 0, 0, 88000, 'Size M|SP000055|5000|b9bd6435-a4f6-4eac-ad5f-adeffaace50a', NULL, TRUE),
('1fb5cb15-4b94-492f-ac57-97ff8c5297a6', 'e65f17fc-d1c0-4856-91d3-fdbcb8e65fe9', '2026-02-01T03:10:12.2940390+00:00', '0f221ecf-21f6-432c-9503-e0887e55fa9f', 'Bạc Xỉu Kem Muối', 33000, 1, NULL, 0, 0, 38000, 'UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713', NULL, TRUE),
('8725529d-9554-469d-9826-78f3d55ee508', 'f01f0f26-1163-4d94-8a28-2877d7f08678', '2026-02-01T03:10:31.1470280+00:00', '6746ceed-0719-43c2-ad21-0eff24b4397d', 'Cafe Kem Cafe', 31000, 1, NULL, 0, 0, 31000, NULL, NULL, TRUE),
('561ffcb9-2ee1-4e4e-8d76-3f959b81f113', '48018d15-0ef5-40bb-ba37-8c6b574ef11d', '2026-02-01T03:10:59.8469926+00:00', '7be13434-8eca-4794-ba08-f30a1267de37', 'Matcha Latte', 27000, 1, NULL, 0, 0, 32000, 'UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713', NULL, TRUE),
('ee55d594-89e4-4ec1-a73c-7ff9e4977509', '48018d15-0ef5-40bb-ba37-8c6b574ef11d', '2026-02-01T03:10:59.8469943+00:00', '9060af17-9a7c-494c-8f53-99ecc77bf60f', 'Trân châu đường đen', 6000, 1, NULL, 0, 0, 6000, NULL, NULL, TRUE),
('768e8219-e676-416b-8578-75c2ecd9c581', '0bc99059-430e-43f4-a8ee-e498634b7354', '2026-02-01T03:11:09.5836800+00:00', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 20000, NULL, NULL, TRUE),
('b8f1a7c8-c7a8-424e-b4f4-097e51de7e4e', 'b94061e9-d7f8-41a4-8fce-b4083d48d923', '2026-02-01T03:11:19.9475435+00:00', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 1, NULL, 0, 0, 27000, NULL, NULL, TRUE),
('7e70a8d9-77da-449f-8123-690a50567211', '5a1bdc7a-d97e-4dcf-96c5-34d9bbc13f36', '2026-02-01T03:11:54.3093819+00:00', '6746ceed-0719-43c2-ad21-0eff24b4397d', 'Cafe Kem Cafe', 31000, 1, NULL, 0, 0, 36000, 'UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713', NULL, TRUE),
('22e15546-40ca-4d8e-b74b-ee3665a731d7', '5a1bdc7a-d97e-4dcf-96c5-34d9bbc13f36', '2026-02-01T03:11:54.3093834+00:00', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 30000, 'Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', NULL, TRUE),
('253c28e0-fbcf-41b5-b68b-dbe99ebfb9b2', '2dfe3322-f5e8-4dc0-9e50-4ff930eaf036', '2026-02-01T03:12:55.3859353+00:00', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 30000, 'Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', NULL, TRUE),
('ec6fef75-4d87-4f1d-8730-95ab563bd5e7', 'af45f7e3-71cd-4203-8218-f33db17cf37f', '2026-02-01T03:13:07.0091819+00:00', '7be13434-8eca-4794-ba08-f30a1267de37', 'Matcha Latte', 27000, 1, NULL, 0, 0, 32000, 'UpSize L|SP-00065|5000|ec676505-d248-4a18-9cd9-a6958914b713', NULL, TRUE),
('d0f4bcb6-91dd-4ace-aeab-186cdc7ee79e', '79511ba5-3a1d-4554-adbb-98db3022b5d4', '2026-02-02T12:34:28.0000000+07:00', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 6, NULL, 0, 0, 162000, 'Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', NULL, TRUE),
('dd91d0a5-9697-4f04-910a-a15a90db1f84', '88040bdc-861d-4418-aa55-f254a7a2525b', '2026-02-02T06:43:45.9416293+00:00', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 27000, 'Size L|SP000056|10000|71bcd18c-4a4b-4bf8-98d6-f4b8b4817213', NULL, TRUE);

-- Table: User
DROP TABLE IF EXISTS "User" CASCADE;
CREATE TABLE "User" (
    "Id" TEXT,
    "email" TEXT,
    "username" TEXT,
    "PasswordHash" TEXT,
    "Role" TEXT,
    "IsActive" BOOLEAN,
    PRIMARY KEY ("Id")
);

INSERT INTO "User" ("Id", "email", "username", "PasswordHash", "Role", "IsActive")
VALUES
('2', 'admin@thecoffeecream.com', 'admin', '$2a$11$wrTB9bhEyd8jUbxn48anc.vXJ56Z/wu0Gg9zX/UxpuVHVdjsZQwwq', 'Admin', TRUE);

-- Table: Plan
DROP TABLE IF EXISTS "Plan" CASCADE;
CREATE TABLE "Plan" (
    "Id" TEXT,
    "Code" TEXT,
    "Name" TEXT,
    "DurationDays" INTEGER,
    "Price" DECIMAL(18,2),
    "Description" TEXT,
    "IsActive" BOOLEAN,
    "IsDefault" BOOLEAN DEFAULT FALSE,
    PRIMARY KEY ("Id")
);

INSERT INTO "Plan" ("Id", "Code", "Name", "DurationDays", "Price", "Description", "IsActive", "IsDefault")
VALUES
('1', 'TRIAL_15_DAYS', 'Trial (15 Days)', 15, 0, 'Free trial for new users', TRUE, TRUE),
('2', 'BASIC_30_DAYS', 'Basic (30 Days)', 30, 500000, 'Basic monthly subscription', TRUE, FALSE),
('3', 'PREMIUM_6_MONTHS', 'Premium (6 Months)', 180, 2500000, 'Premium half-year subscription', TRUE, FALSE),
('4', 'PREMIUM_1_YEAR', 'Premium (1 Year)', 365, 4500000, 'Premium annual subscription', TRUE, FALSE);


-- Relationships

    DO $$ 
    BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Product') 
           AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category') THEN
            ALTER TABLE "Product" 
            ADD CONSTRAINT fk_product_category 
            FOREIGN KEY ("CategoryId") 
            REFERENCES "Category" ("Id");
        END IF;
    END $$;
    
    DO $$ 
    BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'OrderItem') 
           AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Order') THEN
            ALTER TABLE "OrderItem" 
            ADD CONSTRAINT fk_orderitem_order 
            FOREIGN KEY ("OrderId") 
            REFERENCES "Order" ("Id");
        END IF;
    END $$;
    
    DO $$ 
    BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'OrderItem') 
           AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Product') THEN
            ALTER TABLE "OrderItem" 
            ADD CONSTRAINT fk_orderitem_product 
            FOREIGN KEY ("ProductId") 
            REFERENCES "Product" ("Id");
        END IF;
    END $$;
    