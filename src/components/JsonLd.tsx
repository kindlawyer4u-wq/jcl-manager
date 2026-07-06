/** JSON-LD 구조화 데이터를 <script> 로 주입. 서버 컴포넌트에서 렌더. */
export const JsonLd = ({ data }: { data: object }) => (
	<script type="application/ld+json">{JSON.stringify(data)}</script>
);
