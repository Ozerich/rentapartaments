@extends('../welcome')

@section('header')
<header>
    <h2>Добрый день,в приложении появились новые предложения по квартирам</h2>
</header>
@endsection

@section('main_content')
<section role="main">
    <div class="main_content-container">
        <h4>Количество новых квартир: {{$count}}</h4>
        <p>Перейдите по ссылке ниже, для просмотра новых предложений</p>
        <a href="{{route('new_flats')}}">Просмотреть</a>
    </div>
</section>
@endsection

@section('footer')
@include('../partials.footer')
@endsection
