-- Auto-generated SQL script from Excel for PostgreSQL

-- Table: Product
DROP TABLE IF EXISTS "Product";
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
    "ToppingMapping" TEXT
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
('28218217-be9b-4554-89e0-cee61a074ea9', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00011', 'Bạc Xỉu Kem Cafe', 0, 33000, NULL, TRUE, FALSE, 'bdf0dd62-999e-43a1-ad09-d3c0d4abb209;7c4fc531-5fcd-4892-b505-99815dac20cb'),
('0f221ecf-21f6-432c-9503-e0887e55fa9f', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00012', 'Bạc Xỉu Kem Muối', 0, 33000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/a0b0997b4aaa4026b3de092157d07ada', TRUE, FALSE, 'bdf0dd62-999e-43a1-ad09-d3c0d4abb209;7c4fc531-5fcd-4892-b505-99815dac20cb'),
('146a5cc5-aa57-43fc-af71-ffe66ac47385', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP-00013', 'Bạc Xỉu Kem Trứng', 0, 33000, 'https://cdn1-fnb-userdata.kiotviet.vn/2024/07/cafehuynhvanbanh/images/72987776a81b4a9f8729fb34963ba3bc', TRUE, FALSE, 'bdf0dd62-999e-43a1-ad09-d3c0d4abb209;7c4fc531-5fcd-4892-b505-99815dac20cb'),
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
('d44db9fd-1b4d-4f36-a35e-c9fca970c349', '6138ec79-4292-4747-81aa-d0e4d308efda', 'SP000059', 'Cà Phê Kem Vip', 19, 40000, NULL, TRUE, FALSE, NULL),
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
DROP TABLE IF EXISTS "Category";
CREATE TABLE "Category" (
    "Id" TEXT,
    "Name" TEXT,
    "Rank" INTEGER,
    "IsActive" BOOLEAN
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
DROP TABLE IF EXISTS "Order";
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
    "IsActive" BOOLEAN
);

INSERT INTO "Order" ("Id", "ClientOrderId", "CreatedAt", "OrderType", "TableNumber", "PaymentMethod", "CashAmount", "TransferAmount", "DiscountType", "DiscountValue", "DiscountAmount", "SubTotal", "Total", "Status", "Note", "IsActive")
VALUES
('4c447211-3b63-4512-af8a-d432a1254761', '4703b039-4dba-4d14-9b67-b53b427ee844', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 3, 'CASH', 33, 0, NULL, 0, 0, 33, 33, 'DRAFT', NULL, FALSE),
('a05aa4c4-bb3c-4e5e-b9a6-057a5fd06e64', '4703b039-4dba-4d14-9b67-b53b427ee844', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 3, 'CASH', 33, 0, NULL, 0, 0, 33, 33, 'SUCCESS', NULL, FALSE),
('8fb61227-6054-4976-80fd-c0be160d01b3', '0c95f6ee-2d89-442e-befc-82c6c87f6c37', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 2, 'CASH', 36, 0, NULL, 0, 0, 36, 36, 'DRAFT', NULL, FALSE),
('eb633e2c-c5eb-4ff3-8d82-b2d51c3f6b26', '0c95f6ee-2d89-442e-befc-82c6c87f6c37', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 2, 'CASH', 36, 0, NULL, 0, 0, 36, 36, 'SUCCESS', NULL, FALSE),
('901a4b6e-b667-4374-b9f7-a590365cf555', '97d2cb61-19d5-4e8d-a5d1-9ed30e49fbb9', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 2, 'CASH', 27, 0, NULL, 0, 0, 27, 27, 'SUCCESS', NULL, FALSE),
('a1dc7d2c-cf83-4a15-9129-c4e653d0560a', '20e7f24c-bb73-4f2e-bc61-ffbfffff1917', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 1, 'CASH', 7, 0, NULL, 0, 0, 7, 7, 'DRAFT', NULL, FALSE),
('94e7aa9e-bfe0-4fcb-a8e5-7d58641b63fc', 'f51f98b7-debf-47fa-bd9b-95b476fa1666', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 2, 'CASH', 35, 0, NULL, 0, 0, 35, 35, 'DRAFT', NULL, FALSE),
('8c000d15-bbd0-48ca-ac53-88c1321c35f2', '86c64950-ae3e-4420-97b3-3deba3e033a8', '2026-01-22T20:15:32.4008042+00:00', 'DINE_IN', 2, 'CASH', 21108, 0, NULL, 0, 0, 108, 108, 'SUCCESS', NULL, FALSE),
('fde3ac71-6caf-4fdc-a8e9-d0f7f8aec57e', 'e0f13920-cf82-4a93-aab2-09800c69bf5b', '2026-01-23T05:07:51.7243579+00:00', 'DINE_IN', 3, 'COMBINED', 41, 2, NULL, 0, 0, 43, 43, 'SUCCESS', 'Duy áo cưới', FALSE),
('e2475a2a-1bc9-48dc-b66f-0c3c5f8f3919', '2f694bce-3087-4ea0-9b52-7d104807778d', '2026-01-23T05:07:51.7243579+00:00', 'DINE_IN', 1, 'CASH', 20, 0, NULL, 0, 0, 20, 20, 'SUCCESS', NULL, FALSE),
('3d54ef2f-a94f-46cf-a508-33722534a7be', '6291bcd1-7cb8-4981-bba3-207b94b65fba', '2026-01-23T05:07:51.7243579+00:00', 'DINE_IN', 4, 'CASH', 27, 0, NULL, 0, 0, 27, 27, 'SUCCESS', NULL, FALSE),
('9deb60a1-0afd-4516-b52e-1e36ced4629c', '7a95ef42-1022-4436-b76b-3dd766a78dc4', '2026-01-23T05:07:51.7243579+00:00', 'DINE_IN', 3, 'CASH', 20, 0, NULL, 0, 0, 20, 20, 'DRAFT', NULL, FALSE),
('828be22f-9575-4315-8c8d-f5c73d5016a2', 'fb4a9686-52a2-435e-ab78-71e872a2a5d7', '2026-01-24T07:54:05.5119858+00:00', 'DINE_IN', 4, 'CASH', 216, 0, NULL, 0, 0, 216, 216, 'SUCCESS', NULL, FALSE),
('bce4f5c2-64c3-461b-8fb9-0f506fd798cf', 'f4918489-8f22-4d12-a48b-d022c51d0b08', '2026-01-24T08:26:27.9422184+00:00', 'DINE_IN', 0, 'CASH', 68, 0, NULL, 0, 0, 68, 68, 'SUCCESS', NULL, FALSE),
('9d178994-ef97-43a1-9c64-d72d84bb304a', '24c98eb5-2a88-4446-b385-c4d7cc73f57b', '2026-01-24T12:50:39.7456853+00:00', 'DINE_IN', 1, 'COMBINED', 18000, 50000, NULL, 0, 0, 68000, 68000, 'SUCCESS', NULL, FALSE),
('672c52f3-2841-4699-818f-575263756cc4', '918b2e27-d016-4a41-99ad-823bbccb2f02', '2026-01-24T13:16:29.3823065+00:00', 'DINE_IN', 3, 'COMBINED', 12000, 5000, NULL, 0, 0, 17000, 17000, 'SUCCESS', NULL, FALSE),
('47f4479a-4cb5-4f64-ba35-42a8d89ec249', 'cf542fde-0adf-4c5e-b2f8-573006d8bcdd', '2026-01-24T13:27:14.1514102+00:00', 'DINE_IN', 1, 'COMBINED', 18000, 50000, NULL, 0, 0, 68000, 68000, 'SUCCESS', NULL, FALSE),
('d91a1621-eac6-4704-9f02-5c22661b5782', '3a5a776e-7c6d-4193-a50f-43da72e05a8c', '2026-01-24T13:27:18.8592815+00:00', 'DINE_IN', 3, 'CASH', 108000, 0, NULL, 0, 0, 108000, 108000, 'SUCCESS', NULL, FALSE),
('b2b3189b-8cd5-4fe3-8068-49a865d1c351', 'd0aa388c-eab4-4cfa-b4bb-ba351042166e', '2026-01-24T13:27:29.4602934+00:00', 'DINE_IN', 7, 'TRANSFER', 0, 87000, NULL, 0, 0, 87000, 87000, 'SUCCESS', NULL, FALSE),
('4a6c288c-1c83-494f-960a-bd6e8c6e304e', '025aa07d-8a7d-4102-996e-4ff850bcbe22', '2026-01-24T13:33:30.5514018+00:00', 'DINE_IN', 1, 'TRANSFER', 0, 111200, NULL, 0, 0, 139000, 139000, 'SUCCESS', NULL, FALSE),
('0bfce639-b9c8-4f3c-ba4e-9001466f4f14', '5f5ab809-4a5a-4a9d-a09d-4cb73ec177a7', '2026-01-24T13:37:40.5843855+00:00', 'DINE_IN', 7, 'CASH', 80000, 0, NULL, 0, 0, 80000, 80000, 'SUCCESS', NULL, FALSE),
('da7e093d-6f09-4e9d-b17f-36edaae542eb', 'e0f96f4a-3dcc-4166-8843-0dd6bc92d276', '2026-01-24T13:50:24.0137345+00:00', 'DINE_IN', 3, 'CASH', 71000, 0, NULL, 0, 0, 71000, 71000, 'DRAFT', 'Tes note', FALSE),
('4a9ba5c7-f219-490d-a7dd-ab5f52a66199', '86ccba1d-af00-4a40-a0ec-fae291a9151a', '2026-01-24T13:50:39.3193400+00:00', 'DINE_IN', 5, 'CASH', 81000, 0, NULL, 0, 0, 81000, 81000, 'DRAFT', NULL, FALSE),
('e3d4cec2-f6a1-4531-80fe-0b093fb2fb32', '975099cd-1d94-47bb-9c7a-f3b7e1969e21', '2026-01-24T13:52:55.4483308+00:00', 'DINE_IN', 1, 'CASH', 17000, 0, NULL, 0, 0, 17000, 17000, 'DRAFT', NULL, FALSE),
('55aee999-431f-499c-ac67-e6198136a717', 'a4421488-777c-44e3-b9e4-53e154bfd7fd', '2026-01-24T13:57:33.6045077+00:00', 'DINE_IN', 3, 'CASH', 20000, 0, NULL, 0, 0, 20000, 20000, 'SUCCESS', NULL, FALSE),
('1ea213eb-9937-4258-be28-62c9f51af6eb', '2ad3cbe8-b01f-4ebe-8f87-b1f775bb3815', '2026-01-24T14:16:19.6798070+00:00', 'DINE_IN', 1, 'CASH', 17000, 0, NULL, 0, 0, 17000, 17000, 'DRAFT', NULL, FALSE),
('70ab4242-23f9-4afc-8519-2db03800e485', '9f0c8c23-0b88-4473-8aae-bb4894d840dd', '2026-01-24T19:27:13.9817748+00:00', 'DINE_IN', 3, 'COMBINED', 45450, 5550, NULL, 0, 0, 51000, 51000, 'SUCCESS', NULL, FALSE),
('bf8467c7-454e-4d2f-b26c-bf0c4dc2a49d', 'b0fe5896-5276-479b-ba68-88016b2f360c', '2026-01-24T20:15:08.6821213+00:00', 'DINE_IN', 0, 'CASH', 117000, 0, NULL, 0, 0, 117000, 117000, 'SUCCESS', NULL, FALSE),
('22f70c7c-2e8f-41f9-a5e8-01543ed29d4e', '37e47c57-700b-401e-99ec-2cabda810346', '2026-01-24T20:15:20.7433882+00:00', 'DINE_IN', 0, 'CASH', 46000, 0, NULL, 0, 0, 46000, 46000, 'DRAFT', NULL, FALSE),
('f52b511c-9545-4058-8004-e4605fd26ca6', '8ebb3722-82ee-4e8f-ae80-e7fc5832335d', '2026-01-24T20:33:44.1261588+00:00', 'DINE_IN', 3, 'CASH', 20000, 0, NULL, 0, 0, 20000, 20000, 'DRAFT', NULL, FALSE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', 'ac6e88e2-c42e-48ed-b561-7b14709fb3f8', '2026-01-25T05:12:14.7860231+00:00', 'DINE_IN', 1, 'CASH', 344000, 0, NULL, 0, 0, 344000, 344000, 'SUCCESS', NULL, TRUE),
('5319fc5a-2bc1-45a4-a02e-60af14932178', 'eba284e9-7242-423a-9311-1c44eaaa791e', '2026-01-25T05:23:50.0432453+00:00', 'DINE_IN', 1, 'CASH', 22000, 0, NULL, 0, 0, 22000, 22000, 'DRAFT', NULL, TRUE),
('47706816-0114-42aa-bbf7-6c5ea879538d', 'c1c9fee8-ee2b-4c1a-bb0c-39a0d0ed41d7', '2026-01-25T05:42:27.9550435+00:00', 'DINE_IN', 3, 'CASH', 17000, 0, NULL, 0, 0, 17000, 17000, 'DRAFT', NULL, TRUE),
('5d535602-2219-410c-a48c-61a5a418c171', '7b6ad060-9491-4e0e-9657-582df2b2a287', '2026-01-25T06:58:29.7975129+00:00', 'DINE_IN', 0, 'CASH', 17000, 0, NULL, 0, 0, 17000, 17000, 'DRAFT', NULL, TRUE),
('aa0e28b7-0e3d-4bf6-81cd-4f1016007585', 'c7e1c2f4-f714-443b-ab33-9c736ec1e500', '2026-01-25T12:26:55.8435970+00:00', 'DINE_IN', 1, 'CASH', 20000, 0, NULL, 0, 0, 20000, 20000, 'DRAFT', NULL, TRUE),
('7843bd3d-0a50-4485-99b2-5f59a7678d3b', 'e121f99f-3fbc-4982-b2cc-d9e6ec5d2a22', '2026-01-25T14:32:36.7421962+00:00', 'DINE_IN', 3, 'COMBINED', 24000, 50000, NULL, 0, 0, 74000, 74000, 'SUCCESS', NULL, TRUE),
('ef60dad2-450c-4e69-bd52-d8f236b6bcac', '3fc99a64-4459-4926-9618-cf461313212d', '2026-01-25T16:52:25.0549897+00:00', 'DINE_IN', 0, 'CASH', 17000, 0, NULL, 0, 0, 17000, 17000, 'SUCCESS', NULL, TRUE),
('fe4f6429-d64c-49d0-be64-2e60c3ead5db', 'd5331fd0-edd6-4c9a-bfae-ff16e465044f', '2026-01-25T16:53:05.4954062+00:00', 'DINE_IN', 7, 'CASH', 20000, 0, NULL, 0, 0, 20000, 20000, 'DRAFT', NULL, TRUE),
('fe86fca1-802b-4bc9-a589-80bf09c03cc3', '718a2f65-eb25-49dd-81fd-df42ee600ae7', '2026-01-31T14:18:05.1729143+00:00', 'DINE_IN', 5, 'CASH', 132600, 0, NULL, 0, 0, 156000, 156000, 'SUCCESS', NULL, TRUE);

-- Table: OrderItem
DROP TABLE IF EXISTS "OrderItem";
CREATE TABLE "OrderItem" (
    "OrderId" TEXT,
    "ProductId" TEXT,
    "Name" TEXT,
    "UnitPrice" INTEGER,
    "Quantity" INTEGER,
    "DiscountType" TEXT,
    "DiscountValue" INTEGER,
    "DiscountAmount" INTEGER,
    "Total" INTEGER,
    "Note" TEXT,
    "IsActive" BOOLEAN
);

INSERT INTO "OrderItem" ("OrderId", "ProductId", "Name", "UnitPrice", "Quantity", "DiscountType", "DiscountValue", "DiscountAmount", "Total", "Note", "IsActive")
VALUES
('4c447211-3b63-4512-af8a-d432a1254761', '409b1750-5b8e-40b7-8541-24aa6f2092b8', 'cafe sữa hạt', 33, 1, NULL, 0, 0, 33, NULL, FALSE),
('a05aa4c4-bb3c-4e5e-b9a6-057a5fd06e64', '409b1750-5b8e-40b7-8541-24aa6f2092b8', 'cafe sữa hạt', 33, 1, NULL, 0, 0, 33, NULL, FALSE),
('8fb61227-6054-4976-80fd-c0be160d01b3', 'a19e6312-94fc-45a7-8d2f-06c42d7e23ba', 'Cacao sữa dừa kem trứng', 36, 1, NULL, 0, 0, 36, NULL, FALSE),
('eb633e2c-c5eb-4ff3-8d82-b2d51c3f6b26', 'a19e6312-94fc-45a7-8d2f-06c42d7e23ba', 'Cacao sữa dừa kem trứng', 36, 1, NULL, 0, 0, 36, NULL, FALSE),
('901a4b6e-b667-4374-b9f7-a590365cf555', '233410ca-66b9-47a4-8a55-8f98850282ec', 'Matcha Latte Dâu', 27, 1, NULL, 0, 0, 27, NULL, FALSE),
('a1dc7d2c-cf83-4a15-9129-c4e653d0560a', '145744cd-189c-4d0d-bf57-c0331c497e31', 'Bánh Tráng Hành Phi', 7, 1, NULL, 0, 0, 7, NULL, FALSE),
('94e7aa9e-bfe0-4fcb-a8e5-7d58641b63fc', '145744cd-189c-4d0d-bf57-c0331c497e31', 'Bánh Tráng Hành Phi', 7, 5, NULL, 0, 0, 35, NULL, FALSE),
('a05e1f24-38fa-4b1a-b5c0-c2101427dded', 'a19e6312-94fc-45a7-8d2f-06c42d7e23ba', 'Cacao sữa dừa kem trứng', 36, 3, NULL, 0, 0, 108, NULL, FALSE),
('8c000d15-bbd0-48ca-ac53-88c1321c35f2', 'a19e6312-94fc-45a7-8d2f-06c42d7e23ba', 'Cacao sữa dừa kem trứng', 36, 3, NULL, 0, 0, 108, NULL, FALSE),
('4489d58d-cf7b-49f6-a3f6-54915284f223', 'ef7205ac-9b18-4949-b04a-ea634d774841', 'phí ship', 68, 1, NULL, 0, 0, 68, NULL, FALSE),
('95232c93-a0e1-4596-ad9b-c3425e5f1699', 'ef7205ac-9b18-4949-b04a-ea634d774841', 'phí ship', 68, 1, NULL, 0, 0, 68, NULL, FALSE),
('fde3ac71-6caf-4fdc-a8e9-d0f7f8aec57e', '145744cd-189c-4d0d-bf57-c0331c497e31', 'Bánh Tráng Hành Phi', 7, 1, NULL, 0, 0, 7, NULL, FALSE),
('fde3ac71-6caf-4fdc-a8e9-d0f7f8aec57e', '00440a8a-46fb-4fe7-a84d-b394c0366172', 'Cacao Kem Cafe', 36, 1, NULL, 0, 0, 36, NULL, FALSE),
('e2475a2a-1bc9-48dc-b66f-0c3c5f8f3919', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20, 1, NULL, 0, 0, 20, NULL, FALSE),
('3d54ef2f-a94f-46cf-a508-33722534a7be', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27, 1, NULL, 0, 0, 27, NULL, FALSE),
('9deb60a1-0afd-4516-b52e-1e36ced4629c', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20, 1, NULL, 0, 0, 20, NULL, FALSE),
('828be22f-9575-4315-8c8d-f5c73d5016a2', '96c25787-d618-4e62-a462-ced4a309bcfa', 'Sữa tươi Cafe bạc hà', 27, 8, NULL, 0, 0, 216, NULL, FALSE),
('bce4f5c2-64c3-461b-8fb9-0f506fd798cf', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17, 4, NULL, 0, 0, 68, NULL, FALSE),
('9d178994-ef97-43a1-9c64-d72d84bb304a', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 4, NULL, 0, 0, 68000, NULL, FALSE),
('672c52f3-2841-4699-818f-575263756cc4', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, FALSE),
('47f4479a-4cb5-4f64-ba35-42a8d89ec249', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 4, NULL, 0, 0, 68000, NULL, FALSE),
('d91a1621-eac6-4704-9f02-5c22661b5782', '96c25787-d618-4e62-a462-ced4a309bcfa', 'Sữa tươi Cafe bạc hà', 27000, 4, NULL, 0, 0, 108000, NULL, FALSE),
('b2b3189b-8cd5-4fe3-8068-49a865d1c351', '87b9f742-5e2a-4ced-8102-ad0787555a23', 'Cafe Sữa Dừa', 27000, 1, NULL, 0, 0, 27000, NULL, FALSE),
('b2b3189b-8cd5-4fe3-8068-49a865d1c351', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 1, NULL, 0, 0, 27000, NULL, FALSE),
('b2b3189b-8cd5-4fe3-8068-49a865d1c351', '28218217-be9b-4554-89e0-cee61a074ea9', 'Bạc Xỉu Kem Cafe', 33000, 1, NULL, 0, 0, 33000, NULL, FALSE),
('4a6c288c-1c83-494f-960a-bd6e8c6e304e', '96c25787-d618-4e62-a462-ced4a309bcfa', 'Sữa tươi Cafe bạc hà', 27000, 4, NULL, 0, 0, 108000, NULL, FALSE),
('4a6c288c-1c83-494f-960a-bd6e8c6e304e', 'b254080b-879d-4239-8461-cabf3ddc63b1', 'Cafe Kem Trứng', 31000, 1, NULL, 0, 0, 31000, NULL, FALSE),
('0bfce639-b9c8-4f3c-ba4e-9001466f4f14', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 1, NULL, 0, 0, 27000, NULL, FALSE),
('0bfce639-b9c8-4f3c-ba4e-9001466f4f14', '87b9f742-5e2a-4ced-8102-ad0787555a23', 'Cafe Sữa Dừa', 27000, 1, NULL, 0, 0, 27000, NULL, FALSE),
('0bfce639-b9c8-4f3c-ba4e-9001466f4f14', 'be2f1018-c45c-4a8f-9fca-3faef620de52', 'Trà Dâu Đào Nhài', 26000, 1, NULL, 0, 0, 26000, NULL, FALSE),
('da7e093d-6f09-4e9d-b17f-36edaae542eb', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, FALSE),
('da7e093d-6f09-4e9d-b17f-36edaae542eb', '96c25787-d618-4e62-a462-ced4a309bcfa', 'Sữa tươi Cafe bạc hà', 27000, 1, NULL, 0, 0, 27000, NULL, FALSE),
('da7e093d-6f09-4e9d-b17f-36edaae542eb', '87b9f742-5e2a-4ced-8102-ad0787555a23', 'Cafe Sữa Dừa', 27000, 1, NULL, 0, 0, 27000, NULL, FALSE),
('4a9ba5c7-f219-490d-a7dd-ab5f52a66199', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 1, NULL, 0, 0, 27000, NULL, FALSE),
('4a9ba5c7-f219-490d-a7dd-ab5f52a66199', '96c25787-d618-4e62-a462-ced4a309bcfa', 'Sữa tươi Cafe bạc hà', 27000, 2, NULL, 0, 0, 54000, NULL, FALSE),
('e3d4cec2-f6a1-4531-80fe-0b093fb2fb32', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, FALSE),
('55aee999-431f-499c-ac67-e6198136a717', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 20000, NULL, FALSE),
('1ea213eb-9937-4258-be28-62c9f51af6eb', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, FALSE),
('70ab4242-23f9-4afc-8519-2db03800e485', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 3, NULL, 0, 0, 51000, NULL, FALSE),
('bf8467c7-454e-4d2f-b26c-bf0c4dc2a49d', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, FALSE),
('bf8467c7-454e-4d2f-b26c-bf0c4dc2a49d', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 5, NULL, 0, 0, 100000, NULL, FALSE),
('22f70c7c-2e8f-41f9-a5e8-01543ed29d4e', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 20000, NULL, FALSE),
('22f70c7c-2e8f-41f9-a5e8-01543ed29d4e', '10a54543-8afb-4df1-b5be-0f0758d8c5b2', 'Trà Sữa mật ong', 26000, 1, NULL, 0, 0, 26000, NULL, FALSE),
('f52b511c-9545-4058-8004-e4605fd26ca6', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 20000, NULL, FALSE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 20000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 5, NULL, 0, 0, 135000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '14c0d157-1153-4755-9482-f6896439347c', 'Sữa tươi Cafe', 27000, 1, NULL, 0, 0, 27000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '114895a2-9db4-418b-a6a5-fb9533ed31df', 'Cafe Kem Muối', 31000, 1, NULL, 0, 0, 31000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '8c0840dd-c8cd-4a38-bc28-fd594db4773a', 'Trà Cam Đào Nhài', 26000, 1, NULL, 0, 0, 26000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '5fdcb4e2-a2c9-49dd-979e-4d2208ed51ba', 'Trà Dâu', 26000, 1, NULL, 0, 0, 26000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '0f221ecf-21f6-432c-9503-e0887e55fa9f', 'Bạc Xỉu Kem Muối', 33000, 1, NULL, 0, 0, 33000, NULL, TRUE),
('16ffc02a-fd68-48a4-b1a0-6c4975041542', '427f6159-bfe5-45be-a214-ef7809e4500d', 'Cacao Nóng', 29000, 1, NULL, 0, 0, 29000, NULL, TRUE),
('5319fc5a-2bc1-45a4-a02e-60af14932178', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 22000, NULL, TRUE),
('47706816-0114-42aa-bbf7-6c5ea879538d', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, TRUE),
('5d535602-2219-410c-a48c-61a5a418c171', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, TRUE),
('aa0e28b7-0e3d-4bf6-81cd-4f1016007585', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 20000, NULL, TRUE),
('7843bd3d-0a50-4485-99b2-5f59a7678d3b', '90ad4f33-185a-4102-b9e0-4c530b4a8e49', 'Cafe Sữa', 20000, 1, NULL, 0, 0, 20000, NULL, TRUE),
('7843bd3d-0a50-4485-99b2-5f59a7678d3b', '87b9f742-5e2a-4ced-8102-ad0787555a23', 'Cafe Sữa Dừa', 27000, 1, NULL, 0, 0, 27000, NULL, TRUE),
('7843bd3d-0a50-4485-99b2-5f59a7678d3b', '14c0d157-1153-4755-9482-f6896439347c', 'Sữa tươi Cafe', 27000, 1, NULL, 0, 0, 27000, NULL, TRUE),
('ef60dad2-450c-4e69-bd52-d8f236b6bcac', 'ab312563-3889-48a5-a6c6-425fbbf3da53', 'Cafe đen', 17000, 1, NULL, 0, 0, 17000, NULL, TRUE),
('fe86fca1-802b-4bc9-a589-80bf09c03cc3', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 4, NULL, 0, 0, 156000, NULL, TRUE),
('fe86fca1-802b-4bc9-a589-80bf09c03cc3', '7ebcee9e-15d5-4121-8d2e-c33e5e5a41a8', 'Bạc Xỉu', 27000, 4, NULL, 0, 0, 156000, NULL, TRUE);

-- Table: User
DROP TABLE IF EXISTS "User";
CREATE TABLE "User" (
    "Id" TEXT,
    "email" TEXT,
    "username" TEXT,
    "PasswordHash" TEXT,
    "Role" TEXT,
    "IsActive" BOOLEAN
);

INSERT INTO "User" ("Id", "email", "username", "PasswordHash", "Role", "IsActive")
VALUES
('1', 'staff@thecoffeecream.com', 'staff', '$2a$11$jg3NjAXxbBVCkOMHcUkWVuwOekndzS5MyHTmtPp8Q8gttwuo2/UaO', 'Staff', TRUE),
('2', 'admin@thecoffeecream.com', 'admin', '$2a$11$wrTB9bhEyd8jUbxn48anc.vXJ56Z/wu0Gg9zX/UxpuVHVdjsZQwwq', 'Admin', TRUE);

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
    